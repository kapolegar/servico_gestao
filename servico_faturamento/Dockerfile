FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY src ./src

# Criar diretórios necessários
RUN mkdir -p database logs

# Expor porta
EXPOSE 3002

# Comando para iniciar a aplicação
CMD ["npm", "start"]