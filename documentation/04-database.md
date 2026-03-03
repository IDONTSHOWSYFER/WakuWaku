# 04 - Database# 04 — Base de données

Ce document décrit le **schéma logique** de la base de données du projet Waku Waku.
Objectif : stocker les utilisateurs, le catalogue de mangas, la collection/wishlist et les avis.

---

## 1) Tables

### `users`
Stocke les comptes utilisateurs.
- `id` (PK)
- `username` (obligatoire)
- `email` (obligatoire, unique)
- `password_hash` (obligatoire)
- `created_at` (date de création)

---

### `authors`
- `id` (PK)
- `name` (obligatoire)

---

### `genres`
- `id` (PK)
- `name` (obligatoire, unique)

---

### `mangas`
Stocke les mangas du catalogue.
- `id` (PK)
- `title` (obligatoire)
- `synopsis` (optionnel)
- `cover_url` (optionnel)
- `year` (optionnel)
- `release_status` (optionnel)
- `author_id` (FK → authors.id)

---

### `manga_genres`
Table de liaison (many-to-many) entre mangas et genres.
- `manga_id` (FK → mangas.id)
- `genre_id` (FK → genres.id)
- **PK composite** (`manga_id`, `genre_id`)

---

### `collection_items`
Représente la **collection / wishlist** d’un utilisateur.
- `id` (PK)
- `user_id` (FK → users.id)
- `manga_id` (FK → mangas.id)
- `status` (obligatoire) : `WISHLIST | OWNED | READING | READ`
- `added_at` (date d’ajout)

**Contrainte :**
- unique (`user_id`, `manga_id`) → un utilisateur ne peut pas ajouter deux fois le même manga.

---

### `reviews`
Stocke les avis (note + commentaire optionnel).
- `id` (PK)
- `user_id` (FK → users.id)
- `manga_id` (FK → mangas.id)
- `rating` (obligatoire, 0..5)
- `comment` (optionnel)
- `created_at`
- `updated_at` (optionnel)

**Contrainte recommandée :**
- unique (`user_id`, `manga_id`) → un seul avis par utilisateur et par manga.

---

## 2) Relations (résumé)

- `authors (1)` — `(0..*) mangas`
- `mangas (0..*)` — `(0..*) genres` via `manga_genres`
- `users (1)` — `(0..*) collection_items`
- `mangas (1)` — `(0..*) collection_items`
- `users (1)` — `(0..*) reviews`
- `mangas (1)` — `(0..*) reviews`

---

## 3) Règles de gestion (contraintes)

- email utilisateur **unique**
- `status` ∈ {WISHLIST, OWNED, READING, READ}
- `rating` ∈ [0..5]
- un manga apparaît **au plus une fois** dans la collection d’un user (unique user+manga)
- un user poste **au plus un avis** par manga (unique user+manga)