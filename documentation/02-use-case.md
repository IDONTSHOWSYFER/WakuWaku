# 02 — Use Case Diagrams

Ce document décrit les diagrammes de cas d’utilisation (Use Case) du projet **Waku Waku**.

---

## 1) Système Authentification (Use Case Auth)

### Acteurs
- **Utilisateur**
- **Serveur SMTP** (envoi d’emails)
- **App/Provider 2FA** (validation 2FA)

### Cas d’utilisation
- **S’inscrire**
- **Se connecter**
- **Se déconnecter**
- **Réinitialiser MDP**
- **Modifier infos du compte**
  - Changer Username
  - Changer Email
  - Changer MDP
  - Modifier 2FA
- **Vérifier MDP fort**
- **Mail de vérification**
- **Vérification 2FA**

### Relations (simples)
- **S’inscrire** `<<include>>` **Vérifier MDP fort**
- **S’inscrire** `<<include>>` **Mail de vérification** (via **Serveur SMTP**)
- **Réinitialiser MDP** `<<include>>` **Vérifier MDP fort**
- **Changer MDP** `<<include>>` **Vérifier MDP fort**
- **Changer Email** `<<include>>` **Mail de vérification** (via **Serveur SMTP**)
- **Se connecter** `<<extend>>` **Vérification 2FA** (si 2FA activée) via **App/Provider 2FA**

> Export conseillé : `documentation/use-case-auth.png` (ou `.pdf`)

---

## 2) Système Avis / Wishlist / Collection (Use Case Avis)

### Acteurs
- **Utilisateur connecté**
- **Utilisateur sans compte**

### Cas d’utilisation (Utilisateur connecté)
- **Ajouter à la Wishlist**
- **Supprimer de la Wishlist**
- **Ajouter à la collection**
- **Supprimer de la collection**
- **Noter un manga (1–5 étoiles)**
- **Mettre un commentaire**
- **Consulter les détails d’un manga**

### Cas d’utilisation (Utilisateur sans compte)
- **Consulter les détails d’un manga**

### Relations (simples)
- **Supprimer de la Wishlist** `<<extend>>` **Ajouter à la Wishlist**
- **Supprimer de la collection** `<<extend>>` **Ajouter à la collection**
- **Noter un manga** nécessite généralement **Consulter les détails d’un manga**
- **Mettre un commentaire** nécessite généralement **Consulter les détails d’un manga**

> Export conseillé : `documentation/use-case-avis.png` (ou `.pdf`)

---

## 3) Catalogue / Navigation / Collection (Use Case Navigation)

### Acteurs
- **Visiteur**
- **Abonné** (utilisateur connecté)

### Catalogue (Visiteur)
- **Consulter**
  - **Découvrir**
  - **Rechercher**
  - **Détailler** (voir fiche)

### Collection (Abonné)
- **Gérer collection**
  - **Ajouter**
  - **Retirer**
- **Voir collection**

### Relations (simples)
- **Découvrir** `<<extend>>` **Consulter**
- **Rechercher** `<<extend>>` **Consulter**
- **Détailler** `<<extend>>` **Consulter**
- **Gérer collection** `<<extend>>` **Voir collection** (selon ton schéma)

> Export conseillé : `documentation/use-case-navigation.png` (ou `.pdf`)