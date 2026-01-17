# Architecture Styles

IronBackend supports multiple architecture patterns. Choosing the right one is critical for your team's velocity and the system's maintainability.

## 1. Layered Monolith

A traditional layered architecture. Best for small teams and simple applications.

### Structure
```
src/
  controllers/
  services/
  repositories/
  models/
```
-   **Pros**: Low complexity, standard patterns.
-   **Cons**: Prone to coupling over time.

## 2. Modular Monolith (Recommended)

Code is organized by **Business Domain** rather than technical layer. This is the default recommendation for most modern backend projects.

### Structure
```
src/
  modules/
    users/
      api/
      core/
      infra/
    orders/
      api/
      core/
      infra/
```
-   **Pros**: Strong boundaries, scalable codebase, easy refactoring.
-   **Cons**: Higher initial setup.

## 3. Microservices

Fully independent services.

### Structure
```
apps/
  users-service/
  orders-service/
libs/
  shared/
```
-   **Pros**: Independent scaling and deployment.
-   **Cons**: High operational overhead.
