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
    new winston.transports.File({ filename: 'logs/faturamento.log' })
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
    body: req.body
  });
  next();
});

// Injetar dependências nas rotas
app.use((req, res, next) => {
  req.container = container;
  next();
});

// Rotas
app.use('/', require('../presentation/routes/pagamentos'));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'ServicoFaturamento',
    timestamp: new Date().toISOString()
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

const PORT = process.env.PORT || 3002;

// Inicializar conexões
const initializeServices = async () => {
  try {
    // Inicializar banco de dados
    await container.database.initialize();
    
    // Inicializar message broker
    await container.messageBroker.connect();
    
    logger.info('Todos os serviços inicializados com sucesso');
    
    app.listen(PORT, () => {
      logger.info(`ServicoFaturamento rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao inicializar serviços:', error);
    process.exit(1);
  }
};

initializeServices();

module.exports = app;