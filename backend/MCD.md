# Architecture du backend

Le projet est structuré selon une organisation en couches appliquée à chaque domaine fonctionnel (ex : `auction`, `delivery`, `store`).
Chaque domaine contient les mêmes types de composants afin de garantir une cohérence globale, une bonne maintenabilité et une séparation claire des responsabilités.

## Organisation des packages

Chaque module suit la structure suivante :

* `controller`
* `dto`
* `entity`
* `mapper`
* `service`
* `repository`

Cette organisation permet de découpler les différentes parties de l’application tout en gardant une lisibilité élevée.

---

## Description des couches

### controller

Contient les points d’entrée de l’API (REST ou WebSocket).
Les controllers :

* reçoivent les requêtes
* valident les entrées simples
* délèguent la logique métier aux services
* retournent des DTO

Aucune logique métier ne doit être implémentée ici.

---

### dto (Data Transfer Object)

Objets utilisés pour les échanges entre le backend et les clients.
Ils permettent de :

* contrôler les données exposées
* éviter d’exposer directement les entités
* adapter les formats selon les besoins de l’API

---

### entity

Représente le modèle de données persisté en base.
Les entités sont liées à JPA/Hibernate et définissent :

* les tables
* les relations (OneToMany, ManyToOne, etc.)

Elles doivent rester simples et ne pas contenir de logique métier complexe.

---

### mapper

Responsable de la conversion entre `entity` et `dto`.
Cette couche permet de :

* centraliser les transformations
* éviter la duplication de code
* garder des services plus lisibles

---

### service

Contient la logique métier de l’application.
Les services :

* orchestrent les opérations
* appliquent les règles métier
* utilisent les repositories pour accéder aux données

C’est la couche principale du comportement applicatif.

---

### repository

Interface d’accès aux données.
Basée sur Spring Data JPA, elle permet de :

* effectuer des opérations CRUD
* définir des requêtes personnalisées

Les repositories ne contiennent pas de logique métier.

---

## Principes clés

* Séparation stricte des responsabilités
* Aucune logique métier dans les controllers ou repositories
* Utilisation des DTO pour isoler l’API du modèle de données
* Centralisation de la logique dans les services
* Structure identique dans chaque domaine pour plus de cohérence

---

## Avantages

* Code lisible et structuré
* Facilité de maintenance et d’évolution
* Réduction du couplage entre les composants
* Adapté aux projets Spring Boot de taille moyenne à grande

---


# MCD — Delivery War

## Contexte

Le système repose sur un mécanisme d’enchères où :

* un administrateur crée des enchères associées à des créneaux de livraison
* les magasins participent en proposant des offres (bids)
* le meilleur bid remporte le créneau

---

## Entités

### Store

Représente un magasin ou un administrateur.

* id (PK)
* name
* password
* role (ADMIN, STORE)
* balance
* totalSpent
* whalePass (boolean)

---

### DeliverySlot

Représente un créneau de livraison.

* id (PK)
* startTime
* endTime
* capacity
* status (OPEN, CLOSED)

---

### Auction

Représente une enchère créée par un administrateur.

* id (PK)
* startTime
* endTime
* status (OPEN, CLOSED)
* deliverySlotId (FK)

---

### Bid

Représente une offre faite par un magasin sur une enchère.

* id (PK)
* amount
* timestamp
* storeId (FK)
* auctionId (FK)

---

### Delivery

Représente une livraison à effectuer.

* id (PK)
* address
* status
* storeId (FK)
* deliverySlotId (FK)

---

### Route

Représente une tournée de livraison.

* id (PK)
* type (NORMAL, TORTUE)
* capacity

---

## Relations

### Store — Bid

Un magasin peut faire plusieurs offres.

* Store (1) —— (N) Bid
* Un Bid appartient à un seul Store

---

### Auction — Bid

Une enchère contient plusieurs offres.

* Auction (1) —— (N) Bid
* Un Bid appartient à une seule Auction

---

### DeliverySlot — Auction

Un créneau est associé à une enchère.

* DeliverySlot (1) —— (1) Auction

---

### DeliverySlot — Delivery

Un créneau contient plusieurs livraisons.

* DeliverySlot (1) —— (N) Delivery

---

### Store — Delivery

Un magasin possède plusieurs livraisons.

* Store (1) —— (N) Delivery

---

### Route — Delivery

Une tournée regroupe plusieurs livraisons.

* Route (1) —— (N) Delivery

---

## Vue simplifiée

```text
Store (1) ──── (N) Bid (N) ──── (1) Auction (1) ──── (1) DeliverySlot
   │                                              │
   │                                              └── (N) Delivery
   │
   └────────────── (N) Delivery

Route (1) ──── (N) Delivery
```

---

## Contraintes métier

* Une Auction est créée uniquement par un ADMIN
* Un Store ne peut enchérir que s’il a un solde suffisant
* Une Auction est limitée dans le temps
* Le Bid le plus élevé remporte l’enchère
* Un DeliverySlot a une capacité maximale
* Les tournées de type TORTUE sont limitées (petits camions)
* Le classement “Pigeon d’or” est basé sur `totalSpent`

---

## Remarques

* Les DTO ne font pas partie du MCD (niveau applicatif)
* Le ranking peut être calculé dynamiquement (pas besoin de table dédiée)
* Le champ `whalePass` peut évoluer vers une entité dédiée si nécessaire

---
