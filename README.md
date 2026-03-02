# Waku Waku 🍜 — Bibliothèque de mangas (Mangathèque)

**Waku Waku** est une application web de mangathèque : elle permet de parcourir et rechercher des mangas, consulter leurs fiches, et suivre sa collection personnelle (statut de détention/lecture, notes et avis).

## Stack technique
- **Next.js** (TypeScript)
- **Prisma ORM**
- **PostgreSQL**
- **Tailwind CSS**

## Fonctionnalités principales (MVP)

### 📚 Catalogue (sans compte)
- Découvrir le catalogue : liste des mangas (**nouveautés / populaires / au hasard**)
- Rechercher un manga par **titre**
- Filtrer / trier : par **auteur**, **genre** (option : statut de parution / ordre alphabétique)
- Consulter la **fiche manga** : couverture, synopsis, auteur, genres (option : tomes / année)

### ⭐ Collection personnelle (compte requis)
- Ajouter un manga à **ma collection**
- Retirer un manga de **ma collection**
- Suivre avec un **statut** : *Wishlist* / *Possédé* (option : *En cours* / *Lu*)
- Voir **ma collection**

### 📝 Avis (compte requis)
- Noter un manga (**0–5**)
- Écrire un commentaire / avis (optionnel)
- (option simple) Modifier / supprimer mon avis

### 🔐 Comptes (authentification)
- Créer un compte (**inscription**)
- Se connecter / se déconnecter
- Mot de passe oublié (**réinitialisation**)
- (option MVP) Modifier mon profil (pseudo / email)
- (option si demandé) Supprimer mon compte

## Livrables du projet
- **UML** : diagrammes de cas d’utilisation, paquets, classes, séquences
- **Base de données** : schéma + migrations
- **Organisation** : GitHub + Trello (suivi des tâches)