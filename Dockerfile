# Estágio 1: Build da aplicação frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de configuração de pacotes (package.json e package-lock.json)
COPY package*.json ./

# Instala as dependências do frontend
RUN npm ci

# Copia todo o código-fonte restante do projeto para o contêiner
COPY . .

# Faz o build do projeto para produção usando o Vite
RUN npm run build

# Estágio 2: Servidor Node.js (Express) para API + frontend estático
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos do servidor
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copia o código do servidor
COPY server/index.js ./server/

# Copia os arquivos gerados no build do frontend
COPY --from=builder /app/dist ./dist

# Expõe a porta do servidor (3001 por padrão)
ENV NODE_ENV=production
ENV SERVER_PORT=3001
EXPOSE 3001

# Inicia o servidor Express que serve tanto a API quanto o frontend
CMD ["node", "server/index.js"]
