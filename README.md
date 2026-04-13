# DevOps CI/CD API

REST API com autenticação JWT, testes automáticos e CI/CD com GitHub Actions.

## Endpoints

```
POST   /api/auth/register    - Registrar usuário
POST   /api/auth/login       - Login (retorna JWT)
GET    /api/auth/me          - Dados do usuário (protegido)
GET    /health               - Health check
```

## Quick Start

```bash
npm install
npm run dev
```

Acessa: `http://localhost:3000`

## Testing

```bash
npm run test      # Jest (6 testes, 86% coverage)
npm run lint      # ESLint
npm audit         # Security
```

## Docker

```bash
docker-compose up
```

## Stack

- Node.js 18+, Express 4
- JWT + BCrypt autenticação
- Jest testes
- Docker + GitHub Actions CI/CD
