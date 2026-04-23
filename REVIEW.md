# Code Review — Delivery War
*Date : 2026-04-23*

---

## Résumé

| Sévérité | Nombre |
|----------|--------|
| Critique | 5 |
| Haute | 7 |
| Moyenne | 10 |
| Basse | 10 |

---

## CRITIQUE

### 1. Mapper bug — AuctionMapper.toEntity() mappe le mauvais champ
**Fichier :** `backend/.../auction/mapper/AuctionMapper.java` — ligne 41

Le `deliverySlotId` de l'entité est rempli avec `d.getId()` (l'ID de l'enchère) au lieu du vrai `d.getDeliverySlotId()` du DTO. Toutes les enchères créées ou mises à jour ont un `deliverySlotId` incorrect.

```java
// ACTUEL (faux)
.deliverySlotId(DeliverySlotId.builder().val(String.valueOf(d.getId())).build())

// CORRIGÉ
.deliverySlotId(d.getDeliverySlotId() != null
    ? DeliverySlotId.builder().val(d.getDeliverySlotId()).build()
    : null)
```

---

### 2. Mapper bug — DeliveryMapper.toEntity() n'affecte pas store ni deliverySlot
**Fichier :** `backend/.../delivery/mapper/DeliveryMapper.java`

Les champs `storeId` et `deliverySlotId` du DTO ne sont jamais mappés vers l'entité. Les livraisons créées/mises à jour auront `store = null` et `deliverySlot = null`.

---

### 3. Mots de passe en clair
**Fichiers :** `backend/.../store/entity/Store.java`, `StoreService.java`, `data.sql`

Les mots de passe sont stockés et comparés en texte brut. `data.sql` contient `'1234'` et `'admin'` visibles dans le dépôt git.

**À faire :** Implémenter BCrypt (`spring-boot-starter-security`).

---

### 4. Base de données H2 en mémoire
**Fichier :** `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:h2:mem:deliverydb
spring.jpa.hibernate.ddl-auto=create
```

Toutes les données sont perdues à chaque redémarrage. `ddl-auto=create` recrée le schéma à chaque démarrage.

**À faire :** Passer sur PostgreSQL (déjà dans docker-compose sous le profil `--profile postgres`).

---

### 5. Route /admin accessible à tous
**Fichier :** `frontend/src/router/AppRouter.tsx`

Aucun contrôle de rôle sur la route `/admin`. N'importe quel utilisateur (ou visiteur non connecté) peut accéder au dashboard admin en tapant l'URL.

```tsx
// ACTUEL — aucune protection
<Route path="/admin" element={<AppLayout><AdminDashboardPage /></AppLayout>} />
```

---

## HAUTE PRIORITÉ

### 6. @CrossOrigin manquant sur plusieurs controllers
**Fichiers :** `AuctionController.java`, `BidController.java`, `DeliveryController.java`, `DeliverySlotController.java`, `LeaderboardController.java`

Seul `StoreController` a `@CrossOrigin(origins = "*")`. Toutes les requêtes frontend vers `/api/auctions`, `/api/bids`, etc. seront bloquées par le navigateur (CORS error).

---

### 7. Pages frontend encore sur des données mock
**Fichiers :** `DashboardPage.tsx`, `AdminDashboardPage.tsx`, `ProfilePage.tsx`

Ces pages utilisent des tableaux `MOCK_AUCTIONS` / `MOCK_STORES` locaux et ne font aucun appel au backend. Aucun enchère, aucun magasin, aucun solde n'est réel.

---

### 8. Déconnexion ne vide pas le localStorage
**Fichier :** `frontend/src/views/components/AppNavbar.tsx` — ligne 56

Le bouton "Déconnexion" est un simple `<Link to="/login">`. Il ne supprime pas la session (`authModel.removeUser()`). Retourner sur `/dashboard` après déconnexion affiche toujours l'utilisateur.

---

### 9. Aucune garde d'authentification sur les routes protégées
**Fichier :** `frontend/src/router/AppRouter.tsx`

Les routes `/dashboard`, `/profile`, `/admin` ne vérifient pas si l'utilisateur est connecté. Un visiteur non authentifié peut y accéder directement.

---

### 10. Statut des mises inversé à la création
**Fichier :** `backend/.../bid/service/BidService.java` — ligne 49

Toute nouvelle mise est créée avec le statut `OUTBID`. Sémantiquement, une mise fraîchement placée devrait être `WON` (c'est la plus haute à cet instant), et passer à `OUTBID` quand quelqu'un surenchérit.

---

### 11. Pas de protection contre la suppression d'un compte ADMIN
**Fichier :** `backend/.../store/service/StoreService.java` — méthode `deleteStore()`

La méthode vérifie le solde mais pas le rôle. Un compte ADMIN avec solde nul peut être supprimé via l'API.

---

### 12. BidController renvoie 200 au lieu de 201 à la création
**Fichier :** `backend/.../bid/controller/BidController.java` — ligne 25

```java
return ResponseEntity.ok(created); // devrait être HttpStatus.CREATED (201)
```

Incohérent avec `AuctionController` qui utilise correctement `HttpStatus.CREATED`.

---

## MOYENNE PRIORITÉ

### 13. Race condition sur les mises simultanées
**Fichier :** `backend/.../bid/service/BidService.java`

Deux utilisateurs peuvent placer une mise en même temps sans verrou optimiste ni vérification que le montant est supérieur à la mise actuelle. Pas de `@Version` sur l'entité `Bid` ou `Auction`.

---

### 14. Deux méthodes identiques dans BidRepository
**Fichier :** `backend/.../bid/repository/BidRepository.java`

`findBidsByAuctionIdOrderByAmountDesc` et `findLeaderboardByAuctionId` ont exactement la même requête JPQL. L'une des deux est inutile.

---

### 15. LeaderboardService vide
**Fichier :** `backend/.../leaderboard/service/LeaderboardService.java`

La classe est complètement vide. Le `LeaderboardController` appelle directement `StoreService` sans passer par ce service. À supprimer ou à remplir.

---

### 16. DeliverySlotService.findById() retourne null au lieu de lever une exception
**Fichier :** `backend/.../deliverySlot/service/DeliverySlotService.java`

Retourne `null` si non trouvé, alors que tous les autres services lèvent `ResourceNotFoundException`. Incohérence dans la gestion d'erreurs.

---

### 17. API_BASE défini en double dans le frontend
**Fichiers :** `authModel.ts`, `LeaderboardPage.tsx`

```ts
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

Cette constante est recopiée dans chaque fichier. À centraliser dans un fichier `src/config.ts`.

---

### 18. startPrice en Float au lieu de BigDecimal
**Fichier :** `backend/.../auction/entity/Auction.java` — ligne 21

Les montants financiers devraient utiliser `BigDecimal` pour éviter les erreurs d'arrondi. `Store` utilise correctement `BigDecimal` pour `balance` et `totalSpent`.

---

### 19. Endpoint UPDATE d'enchère ne met pas à jour deliverySlot
**Fichier :** `backend/.../auction/service/AuctionService.java` — méthode `updateAuction()`

La méthode met à jour `startPrice`, `startTime`, `endTime`, `status` mais pas `deliverySlotId`.

---

### 20. whalePass sans effet sur la logique métier
**Fichiers :** `Store.java`, `ProfilePage.tsx`

Le champ `whalePass` est stocké et affiché dans la navbar, mais n'a aucun effet sur les enchères, les créneaux VIP ou les priorités. Fonctionnalité incomplète.

---

### 21. passId jamais utilisé
**Fichier :** `backend/.../store/entity/Store.java` — ligne 44

Champ stocké mais jamais lu, jamais référencé dans aucun service. Code mort.

---

### 22. Endpoint DELETE manquant pour les enchères
**Fichier :** `backend/.../auction/controller/AuctionController.java`

Pas de `DELETE /api/auctions/{id}` ni d'endpoint pour clôturer une enchère (`PUT /api/auctions/{id}/close`). Le bouton "Clore" de l'AdminDashboard n'a pas d'API à appeler.

---

## BASSE PRIORITÉ

### 23. Logging DEBUG en production
**Fichier :** `backend/src/main/resources/application.properties` — ligne 14

```properties
logging.level.com.delivery=DEBUG
```

À passer en `INFO` ou `WARN` pour la production.

---

### 24. Swagger sans annotations
**Fichier :** `application.properties` — lignes 11-12

springdoc est configuré mais aucun controller n'a d'annotations `@Operation`, `@ApiResponse` ou `@Schema`. La doc auto-générée sera minimale.

---

### 25. BidMapper — try/catch pour lazy loading
**Fichier :** `backend/.../bid/mapper/BidMapper.java`

Contournement du problème de lazy loading par try/catch silencieux. Corriger avec `@Transactional(readOnly=true)` dans le service ou `FetchType.EAGER` sur la relation.

---

### 26. Pas d'annotations de validation sur les DTOs
**Fichiers :** Tous les DTOs

Aucun `@NotNull`, `@NotBlank`, `@Min`, `@Email`. La validation repose uniquement sur le frontend. Le backend accepte n'importe quelle valeur.

---

### 27. Mots de passe de test dans data.sql versionné
**Fichier :** `backend/src/main/resources/data.sql`

Les credentials `'1234'` et `'admin'` sont visibles dans le dépôt git. À remplacer par des variables d'environnement ou à retirer du versioning.

---

### 28. deliveryCompany sans logique métier
**Fichier :** `backend/.../delivery/entity/Delivery.java`

Champ stocké mais sans validation, sans liste de transporteurs autorisés, sans utilisation dans l'application.

---

### 29. Aucun endpoint de mise à jour du statut de livraison
**Fichier :** `backend/.../delivery/controller/DeliveryController.java`

L'entité `Delivery` a un statut (`PENDING`, `IN_PROGRESS`, `DELIVERED`) mais il n'existe pas d'endpoint pour le faire évoluer.

---

### 30. CSS inline systématique dans les composants React
**Fichiers :** Tous les composants `.tsx`

L'usage massif de `style={{ ... }}` inline rend les composants verbeux et les styles non réutilisables. À migrer progressivement vers des classes CSS ou des variables CSS.

---

## Actions prioritaires recommandées

1. Ajouter `@CrossOrigin(origins = "*")` sur `AuctionController` et `BidController` (bloque toute intégration frontend)
2. Corriger `AuctionMapper.toEntity()` — le `deliverySlotId` actuellement mappé est faux
3. Protéger la route `/admin` avec un contrôle de rôle
4. Implémenter la déconnexion réelle (vider localStorage)
5. Connecter `DashboardPage` au vrai backend `/api/auctions` et `/api/bids`
6. Ajouter un endpoint `PUT /api/auctions/{id}/close` pour clôturer une enchère
