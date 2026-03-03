# 03 — Package Diagram

## Packages
- **UI** : pages et composants (front)
- **API** : routes / controllers
- **Domain** : logique métier (services, règles)
- **Data** : accès aux données (repositories, Prisma/DB)

## Dépendances
- UI **Dependency** → API
- API **Dependency** → Domain
- Domain **Dependency** → Data