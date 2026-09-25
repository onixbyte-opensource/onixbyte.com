---
title: Delta Force Guide API
---

## Backend API Overview

The backend is a Spring Boot 3 application organised under the base package `com.onixbyte.deltaforceguide`:

| Package                                     | Description                       |
|---------------------------------------------|-----------------------------------|
| `controller`                                | REST API endpoint controllers     |
| `service`                                   | Business logic layer              |
| `repository`                                | MyBatis data access layer         |
| `domain`                                    | JPA entity and domain objects     |
| `config`                                    | Spring configuration (security, cache, etc.) |
| `properties`                                | Configuration property classes    |
| `enumeration`                               | Enumerated types                  |
| `shared`                                    | Shared utilities                  |

## API Endpoints

### Authentication

| Method | Path                  | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| `POST` | `/api/auth/login`     | Log in with credentials  | No   |
| `POST` | `/api/auth/refresh`   | Refresh access token     | No   |
| `GET`  | `/api/auth/profile`   | Get current user profile | Yes  |

### Firearms

| Method   | Path                  | Description              |
|----------|-----------------------|--------------------------|
| `GET`    | `/api/firearms`       | List firearms (paginated, filterable by type) |
| `GET`    | `/api/firearms/:id`   | Get firearm by ID        |
| `POST`   | `/api/firearms`       | Create a new firearm     |
| `PUT`    | `/api/firearms/:id`   | Update an existing firearm |
| `DELETE` | `/api/firearms/:id`   | Remove a firearm         |

### Modifications

| Method   | Path                              | Description                    |
|----------|-----------------------------------|--------------------------------|
| `GET`    | `/api/modifications`              | List modifications (paginated, filterable by firearm and tags) |
| `GET`    | `/api/modifications/:id`          | Get modification by ID         |
| `POST`   | `/api/modifications`              | Create a modification          |
| `POST`   | `/api/modifications/batch`        | Batch create modifications     |
| `PUT`    | `/api/modifications/:id`          | Update a modification          |
| `DELETE` | `/api/modifications/:id`          | Remove a modification          |
| `DELETE` | `/api/modifications/batch-delete` | Batch remove modifications     |

### Tags

| Method | Path                  | Description           |
|--------|-----------------------|-----------------------|
| `GET`  | `/api/tags`           | List all tags         |

## Frontend Routes

| Path          | Layout      | Page              | Description                     |
|---------------|-------------|-------------------|---------------------------------|
| `/`           | Hero Layout | Firearms Browser  | Home page — firearm list        |
| `/firearms`   | Hero Layout | Firearms Browser  | Firearm detail and search       |
| `/mod-codes`  | Hero Layout | Modification Codes| Modification code library       |
| `/legal`      | Hero Layout | Legal             | Legal and privacy information   |
| `/login`      | Empty Layout| Login             | User authentication page        |

## Frontend State Management

Redux Toolkit with Redux Persist manages:

- **Auth state** — Access tokens, refresh tokens, user profile
- **Settings state** — User preferences persisted to local storage

## API Client

The frontend uses a shared `WebClient` wrapper around Axios that handles:

- Base URL configuration (pointing to the backend API)
- JWT access token injection via request interceptors
- Automatic token refresh on 401 responses

## Infrastructure

| Component     | Technology                  |
|---------------|-----------------------------|
| Database      | PostgreSQL (with Flyway migrations) |
| Cache         | Redis (session/token storage) |
| File Storage  | AWS S3 (firearm images)     |
| Containerisation | Docker                   |
| Deployment    | Docker Compose behind Nginx  |
