# DevOps CI/CD API 🚀

API REST com autenticação JWT, containerizada com Docker e CI/CD automático via GitHub Actions.

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Acessa: `http://localhost:3000`

---

## 📡 Endpoints

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"João"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get me (🔐 protegido)
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <token>"

# Health
curl http://localhost:3000/health
```

---

## 🏗️ Arquitetura

```
HTTP Request → Express Middleware
  ↓
Routes → Controllers → Services → Database
  ↓
HTTP Response
```

**Stack:**
- Node.js 18+
- Express 4.x
- JWT + BCrypt
- Jest testing
- Docker (170MB multi-stage)
- GitHub Actions CI/CD

---

## 📝 Scripts

```bash
npm start              # Produção
npm run dev            # Desenvolvimento
npm run test           # Testes
npm run lint           # ESLint
npm run lint:fix       # Fix automático
```

---

## 🐳 Docker

```bash
# Build
docker build -t api:latest .

# Run
docker run -p 3000:3000 api:latest

# Compose
docker-compose up -d
docker-compose down
```

---

## 🌿 Git Workflow

```bash
# Feature branch
git checkout -b feature/seu-feature
git add .
git commit -m "feat: descrição"
git push -u origin feature/seu-feature

# Pull Request → GitHub
# → GitHub Actions roda (lint → test → build)
# → Code review
# → Merge
```

---

## 🔐 Segurança

- **JWT**: Tokens autenticados (24h expiry)
- **BCrypt**: Senhas com salt automático (10 rounds)
- **Middleware**: Validação obrigatória em rotas protegidas
- **Environment**: Variáveis sensíveis em `.env` (não comitadas)
- **Docker**: Roda como user `nodejs` (não-root)

---

## 📂 Estrutura

```
src/
├── index.js                    # Express entry point
├── controllers/authController  # HTTP handlers
├── services/authService        # Business logic
├── middleware/                 # Auth, logging, errors
├── routes/auth.js              # Endpoint definitions
├── database/users.js           # In-memory storage
└── tests/auth.test.js          # 6 integration tests

.github/workflows/              # GitHub Actions
├── ci-cd.yml                   # Lint → Test → Build
└── deploy.yml                  # Deploy automático

Dockerfile                       # Multi-stage (170MB)
docker-compose.yml              # Local dev stack
package.json                    # Dependencies
.env / .env.example             # Configuration
```

---

## 🔄 CI/CD Pipeline

Automático em cada `push` ou Pull Request:

1. **Lint** (ESLint) - Valida código
2. **Test** (Jest) - 6 testes de integração
3. **Build** (Docker) - Multi-stage image
4. **Security** (npm audit) - Procura vulnerabilidades

Resultado: Imagem publicada em `ghcr.io/seu-usuario/devops-ci-cd-api`

---

## 📦 Dependências Principais

```json
{
  "express": "4.18.2",         # API framework
  "jsonwebtoken": "9.1.2",     # JWT tokens
  "bcryptjs": "2.4.3",         # Password hashing
  "cors": "2.8.5",             # CORS handling
  "dotenv": "16.3.1"           # Env variables
}
```

Dev dependencies:
- `jest`: Unit & integration tests
- `supertest`: HTTP testing
- `eslint`: Code linting
- `nodemon`: Auto-reload

---

## 📜 License

MIT License - Veja LICENSE.md para detalhes

---

## 🚀 Próximos Passos

1. **Git**: `git push origin main && git push origin develop`
2. **GitHub**: Criar repositório e configurar SSH/token
3. **Features**: Faça branches `feature/*` e Pull Requests
4. **Production**: Deploy a container registry (Heroku, AWS, Azure, etc)

---

## 🔐 Segurança

- ✅ JWT stateless auth (24h expiry)
- ✅ BCrypt hashing (10 rounds)
- ✅ Input validation
- ✅ Middleware protetor
- ✅ Docker non-root user

---

## 📁 Estrutura

```
src/
├── index.js                 (entrada)
├── controllers/authController.js
├── services/authService.js
├── middleware/              (auth, errors, logging)
├── routes/auth.js
├── database/users.js
└── tests/auth.test.js
```

---

## 🔄 CI/CD Pipeline

Automático em: push + PR

**Stages:**
1. Lint (ESLint)
2. Test (Jest)
3. Build (Docker)
4. Security (npm audit)

Imagem publicada em: `ghcr.io/<usuario>/devops-ci-cd-api`

---

## 📦 Dependências

**Produção:**
- express 4.18.2
- jsonwebtoken 9.1.2
- bcryptjs 2.4.3
- dotenv 16.3.1
- cors 2.8.5

**Desenvolvimento:**
- nodemon 3.0.1
- jest 29.7.0
- supertest 6.3.3
- eslint 8.50.0

---

## 📄 Licença

ISC
git clone https://github.com/seu-usuario/devops-ci-cd-api.git
cd devops-ci-cd-api
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

### 4. Iniciar aplicação
```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm start
```

A aplicação estará disponível em `http://localhost:3000`

### 5. Verificar saúde
```bash
curl http://localhost:3000/health
```

---

## 🐳 Docker

### Build da imagem
```bash
# Build single-stage (desenvolvimento)
docker build -t devops-api:latest .

# Verificar imagem
docker images | grep devops-api
```

### Executar container
```bash
# Run com variáveis de ambiente
docker run -d \
  --name devops-api \
  -p 3000:3000 \
  -e NODE_ENV=development \
  devops-api:latest

# Verificar logs
docker logs -f devops-api

# Health check
docker inspect --format='{{json .State.Health}}' devops-api
```

### Docker Compose (Recomendado)
```bash
# Iniciar stack
docker-compose up -d

# Verificar serviços
docker-compose ps

# Ver logs
docker-compose logs -f api

# Parar stack
docker-compose down
```

### Otimizações Docker implementadas:
- ✅ **Multi-stage build:** Reduz tamanho final (170MB → 140MB)
- ✅ **Alpine Linux:** Imagem base pequena
- ✅ **Usuário não-root:** Segurança (user nodejs)
- ✅ **HEALTHCHECK:** Monitoramento automático
- ✅ **.dockerignore:** Não copia arquivos desnecessários
- ✅ **Layer caching:** Melhora velocidade de builds

---

## 📡 Endpoints da API

### 1. **POST /api/auth/register**
Registra um novo usuário

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "João Silva"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "user": {
      "id": "1703001234567",
      "email": "user@example.com",
      "name": "João Silva",
      "createdAt": "2024-12-20T10:30:00.000Z"
    },
    "token": "eyJhbGc..."
  }
}
```

### 2. **POST /api/auth/login**
Realiza login e retorna JWT

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": "1703001234567",
      "email": "user@example.com",
      "name": "João Silva"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. **GET /api/auth/me**
Obtém dados do usuário autenticado

**Request:**
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer eyJhbGc..."
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Dados do usuário obtidos com sucesso",
  "data": {
    "user": {
      "id": "1703001234567",
      "email": "user@example.com",
      "name": "João Silva"
    }
  }
}
```

### 4. **GET /health**
Health check para monitoramento

**Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2024-12-20T10:30:00.000Z",
  "environment": "development"
}
```

---

## 🔄 GitHub Actions e CI/CD

### Pipeline Automático

O workflow `ci-cd.yml` executa automaticamente em:

1. **Push em qualquer branch** (`main`, `develop`, `feature/*`)
2. **Pull Request** para `main` ou `develop`
3. **Trigger manual** via GitHub Actions UI

### Stages do Pipeline:

```
┌──────────────────────────────────────────────────────┐
│             GitHub Actions Workflow                   │
└──────────────────────────────────────────────────────┘
        │
        ├─► Lint (ESLint)
        │   └─ Análise estática de código
        │
        ├─► Test (Jest)
        │   ├─ Testes unitários
        │   ├─ Cobertura de código
        │   └─ Upload para Codecov
        │
        ├─► Build (Docker)
        │   ├─ Setup Docker Buildx
        │   ├─ Login no GitHub Container Registry
        │   ├─ Build multi-stage
        │   └─ Push se main/develop
        │
        ├─► Security (Audit)
        │   └─ npm audit de vulnerabilidades
        │
        └─► Notify
            └─ Resumo do pipeline
```

### Executar Testes Localmente:

```bash
# Todos os testes
npm run test

# Modo watch (reexecuta quando código muda)
npm run test:watch

# Com coverage
npm run test

# Ver relatório HTML
open coverage/lcov-report/index.html
```

### Verificar Linting:

```bash
# Apenas check
npm run lint

# Fix automático
npm run lint:fix
```

### GitHub Container Registry (GHCR)

As imagens Docker são publicadas em: `ghcr.io/seu-usuario/devops-ci-cd-api`

```bash
# Login (use Personal Access Token)
echo $GH_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull imagem
docker pull ghcr.io/seu-usuario/devops-ci-cd-api:main

# Run imagem
docker run -p 3000:3000 ghcr.io/seu-usuario/devops-ci-cd-api:main
```

---

## 🌿 Estratégia de Branches

Usamos **Git Flow** com branchs principais e de suporte:

### Branches Principais:

```
main (production)
│
└─── develop (staging)
     │
     ├─── feature/authentication
     ├─── feature/database
     ├─── bugfix/validation-error
     └─── hotfix/jwt-expiry
```

### Workflow de Desenvolvimento:

#### 1. **Criar nova feature**
```bash
# Atualizar develop
git checkout develop
git pull origin develop

# Criar branch da feature
git checkout -b feature/nova-feature

# Fazer commits
git add .
git commit -m "feat: adicionar nova funcionalidade"
git push origin feature/nova-feature

# Criar Pull Request no GitHub
# Título: [FEATURE] Descrição clara
```

#### 2. **Code Review**
- Verificar padrão de commits
- Confirmar testes passam
- Revisar logs do GitHub Actions
- Aprovar e mergear

#### 3. **Mergear em develop**
```bash
# GitHub faz merge automaticamente após aprovação
git checkout develop
git pull origin develop
```

#### 4. **Release para main (produção)**
```bash
# Apenas de develop para main
git checkout main
git pull origin main
git merge --no-ff develop -m "release: v1.0.0"
git tag -a v1.0.0 -m "Version 1.0.0"
git push origin main --tags
```

### Convenção de Commits (Conventional Commits):

```
feat:      Nova funcionalidade
fix:       Correção de bug
docs:      Documentação
style:     Formatação/lint
refactor:  Mudança sem alterar funcionalidade
test:      Testes
chore:     Tarefas gerais (deps, build)
```

**Exemplos:**
```bash
git commit -m "feat: implementar endpoint de registro"
git commit -m "fix: corrigir validação de email"
git commit -m "docs: adicionar guia de deployment"
```

---

## 🔐 Conceitos Técnicos Explicados

### 1. **JWT (JSON Web Token)**

JWT é um padrão de autenticação sem estado (stateless).

**Estrutura:**
```
Header.Payload.Signature
│      │       │
│      │       └─ HMACSHA256(header + payload, secret)
│      └─ {"id": "123", "email": "user@example.com"}
└─ {"alg": "HS256", "typ": "JWT"}
```

**Fluxo:**
1. Cliente faz login com credenciais
2. Server valida e retorna JWT
3. Cliente armazena token (localStorage/cookie)
4. Cada requisição inclui: `Authorization: Bearer <token>`
5. Server valida assinatura (nenhuma conexão DB necessária)

**Por que JWT? (vs sessões tradicionais)**
- ✅ Escalável (sem armazenar sessões no server)
- ✅ Sem estado (stateless)
- ✅ API-friendly
- ✅ Descentralizado (múltiplos servidores)

### 2. **BCrypt (Hashing de Senha)**

BCrypt é um algoritmo adaptativo de hashing com salt automático.

**Processo:**
```
Senha: "password123"
      │
      ▼
Salt + Iterações + Hashing + Pruning
      │
      ▼
Hash: $2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36DY1AUi
```

**Características:**
- **Slow:** Leva ~0.3s para calcular (resiste força bruta)
- **Salt automático:** Cada senha tem salt único
- **Adaptativo:** Aumenta rounds se processadores ficam melhores

**Por que não MD5/SHA1?**
- ❌ Rápidos demais (vulneráveis a rainbow tables)
- ❌ Sem salt integrado
- ❌ Algoritmos cryptográficos (não de hashing)

### 3. **Middlewares**

Funções que processam requisições sequencialmente antes de chegar à rota.

**Ordem de Execução:**
```
Requisição HTTP
      │
      ▼
   express.json()
      │
      ▼
   express.urlencoded()
      │
      ▼
     CORS
      │
      ▼
 requestLogger
      │
      ▼
   Route (authRoute)
      │
      ├─ authenticate() ← Middleware de proteção
      │
      ▼
   Controller (register/login)
      │
      ▼
  errorHandler()
      │
      ▼
  Resposta HTTP
```

### 4. **Docker Multi-stage Build**

Otimização que reduz tamanho da imagem final.

```dockerfile
# Stage 1: Builder (desenvolvimento)
FROM node:18 AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run lint

# Stage 2: Runtime (produção)
FROM node:18-alpine ← Imagem 10x menor!
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/src ./src ← Copia apenas necessário
```

**Benefício:**
- Build: 500MB (tudo necessário)
- Runtime: 140MB (só código + deps produção)

### 5. **GitHub Actions Workflow**

Automatiza testes, build e deploy em cada push.

**Conceitos:**
- **Trigger:** Evento que dispara (push, pull_request)
- **Job:** Unidade de execução (lint, test, build)
- **Step:** Ação individual (npm install, docker build)
- **Runner:** Máquina que executa (ubuntu-latest)

**Exemplo:**
```yaml
On push to main:
   └─ Lint Job (ubuntu) ──┐
   └─ Test Job (ubuntu) ──┼─ Parallel Execution
   └─ Build Job (ubuntu) ─┘
        └─ (aguarda lint + test)
        └─ Docker Build + Push ao GHCR
```

### 6. **CI/CD (Continuous Integration/Deployment)**

**Continuous Integration (CI):**
- Testa código automaticamente
- Detecta problemas rapidamente
- Mantém código sempre em estado "deployável"

**Continuous Deployment (CD):**
- Deploy automático após testes passarem
- Reduz erros humanos
- Faster time-to-market

**Pipeline desta API:**
```
Developer push → GitHub detects
      │
      ▼
Run Tests + Lint (paralelo)
      │
      ├─ ❌ Falhou? → Notifica developer
      │
      ├─ ✅ Passou? ↓
      │
Build Docker Image
      │
      ├─ Scan segurança (vulnerabilidades)
      │
      ├─ Push ao GitHub Container Registry
      │
      └─ Deploy em staging/production
```

### 7. **Estrutura de Pastas (Clean Architecture)**

```
src/
├── index.js              ← Ponto de entrada
├── controllers/          ← Lógica HTTP (req/res)
│   └── authController.js
├── services/             ← Lógica de negócio
│   └── authService.js
├── middleware/           ← Funções intermediárias
│   ├── auth.js          (JWT validation)
│   ├── errorHandler.js  (tratamento de erros)
│   └── logger.js        (logging)
├── routes/               ← Definição de rotas
│   └── auth.js
├── database/             ← Camada de dados
│   └── users.js         (in-memory db)
└── tests/                ← Testes automatizados
    └── auth.test.js
```

**Camadas:**
1. **Routes:** Mapeia URLs para controllers
2. **Controllers:** Processa requisições HTTP
3. **Services:** Implementa regras de negócio
4. **Database:** Acessa dados
5. **Middleware:** Funcionalidade transversal (auth, logging)

---

## 📊 Linha do Tempo de uma Requisição

```
1. Cliente faz POST /api/auth/login
   └─ Body: {email, password}

2. Express recebe requisição
   └─ Passa por middlewares (json parser, CORS, logger)

3. Router identifica rota /api/auth/login
   └─ Chama authController.login()

4. Controller extrai dados
   └─ Chama authService.login(email, password)

5. Service valida credenciais
   ├─ Busca usuário no database
   ├─ Compara senha com bcrypt.compare()
   └─ Gera JWT se válido

6. Service retorna {user, token}

7. Controller envolve em resposta HTTP 200
   └─ Envia JSON de volta

8. Middleware logger registra:
   └─ {method, url, statusCode, duration}

9. Cliente recebe resposta com token
   └─ Armazena para requisições futuras
```

---

## 🧪 Testando Localmente

### Com Postman/Insomnia:

1. **Registrar:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "teste@example.com",
  "password": "senha123",
  "name": "Teste User"
}
```

2. **Login:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "teste@example.com",
  "password": "senha123"
}
```

3. **Obter dados (usar token retornado):**
```
GET http://localhost:3000/api/auth/me
Authorization: Bearer eyJhbGc...
```

---

## 📝 Licença

ISC

## 👨‍💼 Autor

DevOps Course - Pós-Graduação

---

**Última atualização:** 2024-12-20
