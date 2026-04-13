# 🧪 Guia Completo de Testes - Projeto DevOps

## Requisitos do Projeto Final

```
✅ Commit DEV
✅ PR Automático Main
✅ Lint/Security
✅ Gate de cobertura (80%)
✅ Build Docker
✅ Deploy ECR

🔐 Regra de Ouro:
   Nenhum código entra em produção sem passar pelo 
   crivo da automação!
```

---

## 🔄 FLUXO COMPLETO DE DESENVOLVIMENTO

### 1️⃣ CRIAR FEATURE BRANCH

```bash
cd d:\POSGRADUACAO\devops-ci-cd-api

# Ir para develop (sempre partir daqui!)
git checkout develop
git pull origin develop

# Criar feature branch
git checkout -b feature/sua-feature

# Fazer suas mudanças...
# git add .
# git commit -m "feat: descrição"
```

---

### 2️⃣ TESTAR LOCALMENTE (ANTES DE ENVIAR)

#### **Teste A: Lint (0 errors)**
```bash
npm run lint
```
**Esperado:**
```
✓ ESLint passed with 0 errors/warnings
```

#### **Teste B: Testes Unitários + Coverage Gate 80%**
```bash
npm run test
```
**Esperado:**
```
 PASS  src/tests/auth.test.js
  ✓ deve registrar um novo usuário com sucesso
  ✓ deve retornar erro se campos obrigatórios estão faltando
  ✓ deve retornar erro se senha é muito curta
  ✓ deve fazer login com credenciais válidas
  ✓ deve retornar erro com credenciais inválidas
  ✓ deve retornar status de saúde

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Coverage:    86.59% ✅ (acima de 80%)
```

#### **Teste C: Security Audit**
```bash
npm audit --audit-level=moderate
```
**Esperado:**
```
found 0 vulnerabilities
```

#### **Teste D: Docker Build (Localmente)**
```bash
docker build -t devops-api:test .
docker run -p 3000:3000 devops-api:test
```
**Em outro terminal:**
```bash
curl http://localhost:3000/health
# Esperado: {"status":"UP",...}
```

---

### 3️⃣ ENVIAR PARA GITHUB

```bash
# Adicionar e commitar
git add .
git commit -m "feat: sua feature com tudo testado"

# Enviar feature branch
git push -u origin feature/sua-feature
```

---

### 4️⃣ CRIAR PULL REQUEST

1. Vai em: **https://github.com/evertonnreis/devops-ci-cd-api**
2. Clica em **Pull requests** → **New pull request**
3. Configura:
   - **Base**: `develop`
   - **Compare**: `feature/sua-feature`
4. **GitHub Actions roda AUTOMATICAMENTE** ✅

---

### 5️⃣ GITHUB ACTIONS - PIPELINE AUTOMÁTICO

O workflow **ci-cd.yml** executa sequencialmente:

#### **Job 1: Lint (15s)**
```yaml
- Checkout código
- Setup Node.js
- Instalar dependências
- Executar ESLint
  ❌ FALHA SE: erros de código
```

#### **Job 2: Testes (45s)**
```yaml
- Checkout código
- Setup Node.js
- Instalar dependências
- Executar testes (npm run test)
- Coverage Gate 80%
  ❌ FALHA SE: cobertura < 80%
```

#### **Job 3: Build Docker (120s)**
```yaml
- Checkout código
- Setup Docker Buildx
- Build imagem (170MB)
  ❌ FALHA SE: erro no build
```

#### **Job 4: Security Scan (30s)**
```yaml
- npm audit --audit-level=moderate
  ❌ FALHA SE: vulnerabilidades encontradas
```

#### **Job 5: Deploy ECR (apenas em main)**
```yaml
- Configure AWS credentials
- Login Amazon ECR
- Push image para ECR
  ✅ SÓ RODA EM: main branch
```

---

### 6️⃣ CONDIÇÕES DE MERGE

```
✅ Todos os jobs devem passar:
   ✓ Lint
   ✓ Testes + Coverage 80%
   ✓ Build Docker
   ✓ Security Audit
   ✓ Deploy ECR (se main)

❌ Se algum falhar:
   ⚠️ NÃO PODE FAZER MERGE
   ⚠️ Corrigir e fazer novo push
   ⚠️ GitHub Actions roda novamente
```

---

## 🛡️ BRANCH PROTECTION RULES

Configure no GitHub para bloquear merge automático:

### Passo 1: Ir em Settings
```
https://github.com/evertonnreis/devops-ci-cd-api/settings/branches
```

### Passo 2: Adicionar Branch Protection
- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - Lint e Análise
  - Testes Unitários
  - Build Docker
  - Segurança - Scan
  - Deploy ECR

---

## 📊 CHECKLIST ANTES DE FAZER MERGE

- [ ] **Lint**: `npm run lint` → 0 errors
- [ ] **Testes**: `npm run test` → 6/6 pass
- [ ] **Coverage**: 80%+ linhas cobertas
- [ ] **Security**: `npm audit` → 0 vulnerabilities
- [ ] **Docker**: `docker build` → sucesso
- [ ] **GitHub Actions**: Todos jobs ✅
- [ ] **Code Review**: Aprovado
- [ ] **Merge**: Pode fazer merge em develop/main

---

## 🚀 FLUXO FINAL

```
feature/sua-feature → PR → GitHub Actions → Merge develop → Merge main → Deploy ECR
                            ✅ ✅ ✅ ✅
```

---

## 🐛 SE ALGO FALHAR

### **Cenário 1: Lint Falha**
```bash
npm run lint:fix
git add .
git commit -m "fix: eslint errors"
git push origin feature/sua-feature
# GitHub Actions roda novamente automaticamente
```

### **Cenário 2: Coverage < 80%**
```bash
# Ver cobertura atual
npm run test

# Adicionar mais testes em src/tests/
# Editar arquivos para ter 80%+ cobertura

git add .
git commit -m "test: improve coverage to 80%"
git push origin feature/sua-feature
```

### **Cenário 3: Docker Build Falha**
```bash
# Testar build localmente
docker build -t api .

# Corrigir Dockerfile ou dependências
git add .
git commit -m "fix: docker build issue"
git push origin feature/sua-feature
```

### **Cenário 4: Vulnerabilidade encontrada**
```bash
# Ver qual é
npm audit

# Atualizar package que tem vulnerabilidade
npm install package@latest

# Commitar
git add package.json package-lock.json
git commit -m "fix: security vulnerability in package"
git push origin feature/sua-feature
```

---

## 📋 RESUMO VISUAL

```
╔═══════════════════════════════════════════════════════════╗
║        CI/CD PIPELINE - NENHUM CÓDIGO SEM TESTES        ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Seu Código → Feature Branch → Pull Request              ║
║                                    ↓                      ║
║                            GitHub Actions:               ║
║                              • Lint (0 errors)            ║
║                              • Test (6/6 pass)            ║
║                              • Coverage (80%+)            ║
║                              • Security Scan              ║
║                              • Docker Build               ║
║                                    ↓                      ║
║                            Code Review ✅                 ║
║                                    ↓                      ║
║                         Merge PR → Develop                ║
║                                    ↓                      ║
║                         Merge Develop → Main              ║
║                                    ↓                      ║
║                            Deploy to ECR 🚀               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 🔐 VARIÁVEIS NECESSÁRIAS NO GITHUB (Para ECR)

Settings → Secrets and variables → Actions

```
AWS_ACCESS_KEY_ID        → Seu Access Key da AWS
AWS_SECRET_ACCESS_KEY    → Seu Secret Key da AWS
```

---

**LEMBRETE IMPORTANTE:**
```
Nenhum código entra em produção sem passar pelo 
crivo da automação! 🔐
```

Se tudo passou localmente, vai passar no GitHub Actions também! ✅
