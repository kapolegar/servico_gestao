FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src ./src

# Criar diretório de logs
RUN mkdir -p logs

# Expor porta
EXPOSE 3003

# Comando para iniciar a aplicação
CMD ["npm", "start"]