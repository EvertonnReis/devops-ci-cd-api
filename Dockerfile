# Stage 1: Build
# Use uma imagem Node.js oficial como base
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências de produção e dev (necessário para build)
RUN npm ci

# Copia todo o código fonte
COPY . .

# Executa testes e linting (opcional)
RUN npm run lint || true

# Stage 2: Runtime
# Usa uma imagem Node.js limpa para a imagem final (reduz tamanho)
FROM node:18-alpine

# Define labels para identificar a imagem
LABEL maintainer="devops@example.com"
LABEL description="API Node.js com Express para aula de DevOps"

# Define o diretório de trabalho
WORKDIR /app

# Cria um usuário não-root por segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copia package.json da imagem builder
COPY package*.json ./

# Instala apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

# Copia aplicação da imagem builder
COPY --from=builder /app/src ./src

# Muda propriedade de arquivos para o usuário não-root
RUN chown -R nodejs:nodejs /app

# Muda para o usuário não-root
USER nodejs

# Expõe a porta que a aplicação utiliza
EXPOSE 3000

# Health check - verifica se a aplicação está saudável
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar a aplicação
CMD ["node", "src/index.js"]
