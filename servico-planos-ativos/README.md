# Serviço Planos Ativos

## Descrição
Serviço responsável por verificar se os planos dos clientes estão ativos, utilizando cache para otimizar performance.

## Funcionalidades
- Verificação de status de planos ativos
- Cache em memória para otimização
- Integração com serviços de gestão e faturamento
- Sistema de mensageria para eventos

## Instalação

```bash
npm install
```

## Configuração

Crie um arquivo `.env` com as seguintes variáveis:

```
PORT=3003
NODE_ENV=development
SERVICO_GESTAO_URL=http://localhost:3001
SERVICO_FATURAMENTO_URL=http://localhost:3002
CACHE_TTL=300
LOG_LEVEL=info
```

## Execução

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## Endpoints

### GET /health
Health check do serviço

### GET /api/planos-ativos/verificar/:clienteId
Verifica se o plano do cliente está ativo

### DELETE /api/planos-ativos/cache/:clienteId
Invalida o cache para um cliente específico

## Arquitetura

O serviço segue os princípios da Clean Architecture:

- **Domain**: Lógica de negócio e entidades
- **Application**: Casos de uso
- **Infrastructure**: Implementações técnicas (cache, HTTP, messaging)
- **Presentation**: Controllers e rotas

## Dependências

- Express.js para servidor HTTP
- Winston para logging
- Node-cache para cache em memória
- Axios para cliente HTTP
- Helmet e CORS para segurança