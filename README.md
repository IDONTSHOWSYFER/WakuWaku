# Waku Waku 🍜 — Bibliothèque de mangas (Mangathèque)

**Waku Waku** est une application web de mangathèque : elle permet de parcourir et rechercher des mangas, consulter leurs fiches, et suivre sa collection personnelle avec un statut de détention, des notes et des avis.

## Stack technique
- Next.js (TypeScript)
- Prisma ORM
- PostgreSQL
- Tailwind CSS

## Fonctionnalités principales (MVP)
Catalogue (accessible sans compte)
	•	Découvrir le catalogue : voir la liste des mangas (nouveautés / populaires / au hasard)
	•	Rechercher un manga par titre
	•	Filtrer / trier : par auteur, genre, (option) statut de parution / ordre alphabétique
	•	Consulter la fiche manga : couverture, synopsis, auteur, genres, (option) tomes / année

Collection personnelle (compte requis)
	•	Ajouter un manga à ma collection
	•	Retirer un manga de ma collection
	•	Suivre l’avancement avec un statut de lecture : Wishlist / Possédé
	•	Voir ma collection

Avis (compte requis)
	•	Noter un manga (0–5)
	•	Écrire un commentaire / avis (optionnel)
	•	(option simple) Modifier / supprimer mon avis

Comptes (authentification)
	•	Créer un compte (inscription)
	•	Se connecter / se déconnecter
	•	Mot de passe oublié (réinitialisation)
	•	(option MVP) Modifier mon profil (pseudo / email)
	•	(option si demandé) Supprimer mon compte

## Livrables du projet
- UML : diagrammes de cas d’utilisation, paquets, classes, séquences
- Schéma de base de données et migrations
- Suivi du projet via GitHub + Trello (gestion des tâches)
