# Delivery War — Plan d'architecture cible

## Contexte

Le projet actuel fonctionne mais présente trois problèmes majeurs :
- **Pas de temps réel** : le dashboard rafraîchit toutes les 5 s via `setInterval`, ce qui est coûteux et désynchronisé
- **Base de données éphémère** : H2 in-memory → données perdues à chaque redémarrage Docker (PostgreSQL est défini dans le compose mais derrière un profil jamais activé)
- **Architecture brouillonne** : endpoints éparpillés, pas de couche WebSocket, code de gestion d'état dupliqué dans chaque page

Objectif : WebSockets (STOMP/SockJS), PostgreSQL persistant, Docker propre, frontend structuré.

---

## Stack cible

| Couche | Technologie |
|--------|-------------|
| Backend | Spring Boot 3.2.4 + `spring-boot-starter-websocket` |
| Protocole temps réel | STOMP over SockJS (`/ws` endpoint) |
| Base de données | PostgreSQL 15 (Docker) |
| Migration schema | `spring.jpa.hibernate.ddl-auto=create` + `data.sql` PostgreSQL-compatible |
| Frontend | React 19 + TypeScript + `@stomp/stompjs` + `sockjs-client` |
| Proxy | Nginx (déjà configuré pour WebSocket upgrade) |
| Infra | Docker Compose (3 services : backend, frontend, db) |

---

## Architecture WebSocket

### Topics STOMP (backend → frontend, broadcast)

| Topic | Déclencheur | Payload |
|-------|------------|---------|
| `/topic/auctions` | Scheduler (statut change) | `List<AuctionDto>` |
| `/topic/auction/{id}` | Bid placé sur l'enchère `id` | `BidDto` (nouveau bid) |

### Queue STOMP (backend → frontend, user-specific)

| Queue | Déclencheur | Payload |
|-------|------------|---------|
| `/queue/store/{storeId}/balance` | Bid placé ou surenchéri | `{ balance, reservedBalance }` |

### Flux côté frontend

```
1. Mount DashboardPage
   → GET /api/auctions (chargement initial)
   → GET /api/bids/store/{id} (mes mises)
   → STOMP.subscribe("/topic/auctions")       ← statuts mis à jour
   → STOMP.subscribe("/topic/auction/{id}")   ← pour chaque enchère active
   → STOMP.subscribe("/queue/store/{id}/balance") ← balance temps réel

2. Quelqu'un enchérit
   → POST /api/bids (REST, déclenche le serveur)
   → Backend push → /topic/auction/{id} (nouveau bid pour tous)
   → Backend push → /queue/store/{ancienLeader}/balance (remboursement)
   → Backend push → /queue/store/{newLeader}/balance (déduction)

3. Enchère PENDING → OPEN (scheduler 15s)
   → Backend push → /topic/auctions (liste mise à jour pour tous)
```

---

## Changements backend

### 1. `pom.xml`
Ajouter :
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>
<dependency>
  <groupId>org.postgresql</groupId>
  <artifactId>postgresql</artifactId>
  <scope>runtime</scope>
</dependency>
```
Supprimer :
```xml
<!-- com.h2database:h2 -->
```

### 2. Nouveau fichier : `config/WebSocketConfig.java`
```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic", "/queue");
        registry.setApplicationDestinationPrefixes("/app");
    }
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
    }
}
```

### 3. `BidService.java` — injection `SimpMessagingTemplate`
Après `repository.save(bid)` :
```java
// Notifier tous les watchers de cette enchère
template.convertAndSend("/topic/auction/" + auction.getId(), mapper.toDto(saved));
// Notifier les balances (remboursement ancien leader + déduction nouveau)
template.convertAndSend("/queue/store/" + oldStore.getId() + "/balance",
    Map.of("balance", oldStore.getBalance(), "reservedBalance", oldStore.getReservedBalance()));
template.convertAndSend("/queue/store/" + store.getId() + "/balance",
    Map.of("balance", store.getBalance(), "reservedBalance", store.getReservedBalance()));
```

### 4. `AuctionScheduler.java` — push après chaque transition
Après `saveAll(toOpen)` et `saveAll(toClose)` :
```java
if (!toOpen.isEmpty() || !toClose.isEmpty()) {
    List<AuctionDto> updated = auctionRepository.findAll().stream()
        .map(mapper::toDto).toList();
    template.convertAndSend("/topic/auctions", updated);
}
```

### 5. `application.properties` — deux profils

**`application.properties` (commun) :**
```properties
spring.application.name=delivery
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.api-docs.path=/v3/api-docs
logging.level.com.delivery=INFO
```

**`application-dev.properties` (local, H2) :**
```properties
spring.datasource.url=jdbc:h2:mem:deliverydb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

**`application-prod.properties` (Docker, PostgreSQL) :**
```properties
spring.datasource.url=jdbc:postgresql://delivery-db:5432/delivery
spring.datasource.username=${DB_USER:delivery}
spring.datasource.password=${DB_PASSWORD:delivery123}
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=create
spring.sql.init.mode=always
spring.jpa.defer-datasource-initialization=true
```

### 6. `data.sql` — syntaxe PostgreSQL

Remplacer `DATEADD('HOUR', 2, NOW())` → `NOW() + INTERVAL '2 hours'`  
Remplacer `ALTER TABLE delivery_slots ALTER COLUMN id RESTART WITH 4` → `SELECT setval(pg_get_serial_sequence('delivery_slots','id'), max(id)) FROM delivery_slots;`

Les IDs des delivery_slots seront référencés dans les auctions via sous-requête ordonnée.

---

## Changements frontend

### 1. Dépendances à installer
```bash
npm install @stomp/stompjs sockjs-client
npm install -D @types/sockjs-client
```

### 2. Nouveau fichier : `src/lib/wsClient.ts`
Client STOMP singleton :
```ts
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = (import.meta.env.VITE_API_URL || '/api').replace('/api', '') + '/api/ws';

let client: Client | null = null;

export function getStompClient(): Client {
  if (!client) {
    client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      reconnectDelay: 5000,
    });
  }
  return client;
}
```

### 3. Nouveau hook : `src/hooks/useAuctions.ts`
```ts
export function useAuctions(userId: number | undefined) {
  const [auctions, setAuctions] = useState<DisplayAuction[]>([]);
  // Chargement initial REST + subscribe STOMP
  // Retourne { auctions, reload }
}
```

### 4. `DashboardPage.tsx` — supprimer `setInterval`
- Remplacer le `setInterval(() => loadAuctions(), 5000)` par subscriptions STOMP
- Subscribe `/topic/auctions` → mettre à jour la liste complète
- Subscribe `/topic/auction/{id}` pour chaque enchère active → mettre à jour le bid courant
- Subscribe `/queue/store/{userId}/balance` → mettre à jour le solde affiché

### 5. `AppNavbar.tsx` — solde temps réel via WS
- Remplacer l'event custom `user-updated` par subscription STOMP `/queue/store/{id}/balance`

---

## Changements Docker

### `docker-compose.yml`
```yaml
services:
  delivery-db:             # Plus de 'profiles' — toujours démarré
    image: postgres:15-alpine
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "delivery"]
      interval: 5s
      retries: 10

  delivery-backend:
    depends_on:
      delivery-db:
        condition: service_healthy   # Attend que la DB soit prête
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_USER=delivery
      - DB_PASSWORD=delivery123

  delivery-frontend:
    depends_on:
      - delivery-backend
```

### `frontend/nginx.conf` — headers WebSocket (déjà OK)
Le proxy `/api` avec `Upgrade` et `Connection: upgrade` est déjà en place. Aucun changement nécessaire.

---

## Structure de fichiers finale

```
Delivery-War/
├── docker-compose.yml
├── ARCHITECTURE.md              ← ce fichier
│
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── resources/
│       │   ├── application.properties
│       │   ├── application-dev.properties
│       │   ├── application-prod.properties
│       │   └── data.sql
│       └── java/com/delivery/
│           ├── DeliveryApplication.java
│           ├── config/
│           │   └── WebSocketConfig.java      ← NOUVEAU
│           ├── common/exception/             (inchangé)
│           ├── store/                        (inchangé)
│           ├── auction/
│           │   ├── scheduler/AuctionScheduler.java  ← push WS
│           │   └── ...                       (inchangé)
│           ├── bid/
│           │   └── service/BidService.java   ← push WS
│           └── deliverySlot/                 (inchangé)
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── lib/
        │   └── wsClient.ts                   ← NOUVEAU
        ├── hooks/
        │   └── useAuctions.ts                ← NOUVEAU
        ├── models/                           (inchangé)
        ├── controllers/                      (inchangé)
        ├── interfaces/                       (inchangé)
        └── views/
            ├── components/                   (inchangé)
            └── pages/
                └── DashboardPage.tsx         ← remplace polling par WS
```

---

## Ordre d'implémentation

1. **Backend — pom.xml** : ajouter websocket + postgresql, retirer H2
2. **Backend — WebSocketConfig.java** : configurer STOMP/SockJS
3. **Backend — application properties** : profils dev/prod
4. **Backend — data.sql** : syntaxe PostgreSQL
5. **Backend — BidService** : push `/topic/auction/{id}` + `/queue/store/{id}/balance`
6. **Backend — AuctionScheduler** : push `/topic/auctions` sur transition
7. **docker-compose.yml** : activer postgres, depends_on conditionnel
8. **Frontend — install deps** : @stomp/stompjs + sockjs-client
9. **Frontend — wsClient.ts** : singleton STOMP
10. **Frontend — DashboardPage** : supprimer setInterval, ajouter subscriptions
11. **Frontend — AppNavbar** : balance via WS
12. **Build & test Docker** : `docker compose up --build`

---

## Tests de validation

| Scénario | Attendu |
|----------|---------|
| Deux onglets ouverts, Store A enchérit | Store B voit le nouveau montant instantanément (< 200ms) |
| Admin crée une enchère PENDING | Apparaît dans "À venir" sur tous les onglets |
| Scheduler passe une enchère OPEN | Badge passe à "En cours" sans rechargement |
| Store enchéri et surenchéri | Son solde se met à jour en temps réel dans la navbar |
| `docker compose down && docker compose up` | Données PostgreSQL persistées entre redémarrages |
| Coupure réseau de 5s | Reconnexion STOMP automatique (`reconnectDelay: 5000`) |
