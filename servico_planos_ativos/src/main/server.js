const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const container = require('../config/container');

const app = express();

// Configuração do logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/planos-ativos.log' })
  ]
});

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    params: req.params
  });
  next();
});

// Injetar dependências
app.use((req, res, next) => {
  req.container = container;
  next();
});

// Rotas
app.use('/', require('../presentation/routes/planosativos'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ServicoPlanosAtivos',
    timestamp: new Date().toISOString(),
    cache: {
      size: container.cache.size(),
      type: 'in-memory'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  logger.error('Erro:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3003;

// Inicializar serviços
const initializeServices = async () => {
  try {
    // Conectar ao message broker
    await container.messageBroker.connect();
    
    // Configurar listener para eventos de pagamento
    await container.messageBroker.subscribe('PagamentoPlanoServicoPlanosAtivos', (evento) => {
      logger.info('Evento de pagamento recebido:', evento);
      // Remover da cache para forçar nova consulta
      container.cache.remove(evento.codAss);
    });
    
    logger.info('ServicoPlanosAtivos inicializado com sucesso');
    
    app.listen(PORT, () => {
      logger.info(`ServicoPlanosAtivos rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao inicializar serviços:', error);
    process.exit(1);
  }
};

initializeServices();

module.exports = app;