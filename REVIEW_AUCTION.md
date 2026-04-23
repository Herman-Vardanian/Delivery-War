# Review Auction — état actuel
*Date : 2026-04-23 — relu sur fichiers réels*

---

## 🔴 CRITIQUE

### 1. @CrossOrigin absent sur AuctionController et BidController
**Fichiers :** `auction/controller/AuctionController.java` ligne 15, `bid/controller/BidController.java` ligne 12

Aucune annotation `@CrossOrigin`. Toutes les requêtes du navigateur vers `/api/auctions` et `/api/bids` sont bloquées (CORS error). Seul `StoreController` a l'annotation.

---

### 2. createAuction oblige à fournir un deliverySlotId existant en base
**Fichier :** `auction/service/AuctionService.java` ligne 37

```java
DeliverySlot slot = deliverySlotRepository.findById(dto.getDeliverySlotId())
        .orElseThrow(() -> new ResourceNotFoundException("Delivery slot not found"));
```

Impossible de créer une enchère sans avoir d'abord créé un `DeliverySlot` en base. Il n'existe aucune interface frontend pour ça. Si `deliverySlotId` est null ou inexistant → le backend renvoie 404 et l'enchère n'est pas créée.

---

### 3. Champ `zone` absent de Auction et AuctionDto
**Fichiers :** `auction/entity/Auction.java`, `auction/dto/AuctionDto.java`

L'entité et le DTO n'ont pas de champ `zone` (ex : "Paris 18e"). Le frontend attend ce champ pour afficher les enchères. Toutes les zones apparaîtront vides.

---

### 4. AuctionMapper ne mappe pas zone
**Fichier :** `auction/mapper/AuctionMapper.java`

Conséquence directe du problème #3 : même si `zone` est ajouté, il n'est mappé ni dans `toDto()` ni dans `toEntity()`.

---

## 🟠 HAUTE

### 5. BidDto.timestamp est LocalDateTime — problème de sérialisation JSON
**Fichier :** `bid/dto/BidDto.java` ligne 6

```java
private LocalDateTime timestamp;
```

Jackson sérialise `LocalDateTime` en tableau `[2026,4,23,14,0,0]` par défaut au lieu de `"2026-04-23T14:00:00"`. Le frontend recevra un tableau, pas une string. À corriger avec `@JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")` ou en ajoutant `spring.jackson.serialization.write-dates-as-timestamps=false` dans `application.properties`.

---

### 6. createBid ne vérifie pas que le montant est supérieur à la mise actuelle
**Fichier :** `bid/service/BidService.java` ligne 43

```java
Bid bid = mapper.toEntity(dto);
bid.setStore(store);
bid.setAuction(auction);
bid.setTimestamp(LocalDateTime.now());
bid.setStatus(BidStatus.OUTBID);
```

N'importe quel montant est accepté, même 0 ou inférieur à la mise la plus haute existante. Pas de vérification `amount > highestBid`.

---

### 7. createBid ne vérifie pas que l'enchère est encore OPEN
**Fichier :** `bid/service/BidService.java`

On peut placer une mise sur une enchère `CLOSED` ou `PENDING`. Aucune vérification de `auction.getStatus() == AuctionStatus.OPEN` ni de `auction.getEndTime().isAfter(LocalDateTime.now())`.

---

### 8. Pas d'endpoint pour clôturer une enchère
**Fichier :** `auction/controller/AuctionController.java`

Il n'existe pas de `PUT /api/auctions/{id}/close`. Pour passer une enchère à `CLOSED`, il faut appeler `PUT /api/auctions/{id}` en renvoyant tous les champs (startTime, endTime, startPrice, status). Il n'y a pas non plus de mécanisme automatique qui ferme les enchères expirées côté backend.

---

### 9. updateAuction sans contrôle de rôle
**Fichier :** `auction/controller/AuctionController.java` ligne 66

`PUT /api/auctions/{id}` est accessible sans vérification de rôle. N'importe quel utilisateur peut modifier une enchère.

---

## 🟡 MOYENNE

### 10. startPrice en Float au lieu de BigDecimal
**Fichier :** `auction/entity/Auction.java` ligne 21, `auction/dto/AuctionDto.java` ligne 15

`Float` introduit des erreurs d'arrondi sur les montants financiers. `Store` utilise `BigDecimal` pour `balance` et `totalSpent` — incohérent.

---

### 11. validateAuctionTimes ne vérifie pas que endTime est dans le futur
**Fichier :** `auction/service/AuctionService.java` ligne 94

La validation vérifie seulement `startTime < endTime`, pas que `endTime > now`. On peut créer une enchère déjà expirée au moment de la création.

---

### 12. BidService.createBid : status toujours OUTBID à la création
**Fichier :** `bid/service/BidService.java` ligne 46

```java
bid.setStatus(BidStatus.OUTBID);
```

Toute nouvelle mise est créée avec le statut `OUTBID`, même si c'est la plus haute. Sémantiquement incorrect — la première mise devrait être `WON` jusqu'à ce qu'elle soit surenchérie.

---

### 13. Deux méthodes identiques dans BidRepository
**Fichier :** `bid/repository/BidRepository.java`

`findBidsByAuctionIdOrderByAmountDesc` et `findLeaderboardByAuctionId` ont la même requête JPQL. L'une des deux est redondante.

---

### 14. Aucun filtrage par statut dans listAuctions
**Fichier :** `auction/service/AuctionService.java` méthode `listAuctions()`

`GET /api/auctions` renvoie toutes les enchères (OPEN + PENDING + CLOSED) sans possibilité de filtre. Le frontend doit tout charger et trier lui-même.

---

## Résumé

| Sévérité | Nombre |
|----------|--------|
| 🔴 Critique | 4 |
| 🟠 Haute | 5 |
| 🟡 Moyenne | 5 |
| **Total** | **14** |
