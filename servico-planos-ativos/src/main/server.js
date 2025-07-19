require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const Container = require('../config/container');
const createPlanosAtivosRoutes = require('../presentation/routes/planosativos');

// Configurar logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Middleware de log
const logMiddleware = (req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
};

// Middleware de erro
const errorHandler = (err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor'
  });
};

async function initializeServices() {
  try {
    const container = new Container();
    
    // Inicializar message broker
    const messageBroker = container.get('messageBroker');
    if (messageBroker && typeof messageBroker.connect === 'function') {
      await messageBroker.connect();
    }

    logger.info('Serviços inicializados com sucesso');
    return container;
  } catch (error) {
    logger.error('Erro ao inicializar serviços:', error);
    throw error;
  }
}

async function startServer() {
  try {
    const container = await initializeServices();
    const app = express();
    
    // Middlewares globais
    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(logMiddleware);

    // Rotas
    app.use('/api/planos-ativos', createPlanosAtivosRoutes(container));

    // Rota de health check global
    app.get('/health', (req, res) => {
      res.json({
        service: 'servico-planos-ativos',
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      });
    });

    // Middleware de erro
    app.use(errorHandler);

    const port = process.env.PORT || 3003;
    
    app.listen(port, () => {
      console.log(`🚀 ServiçoPlanosAtivos rodando na porta ${port}`);
      console.log(`📊 Health check disponível em: http://localhost:${port}/health`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      logger.info('Recebido SIGTERM, iniciando shutdown graceful...');
      const messageBroker = container.get('messageBroker');
      if (messageBroker && typeof messageBroker.disconnect === 'function') {
        await messageBroker.disconnect();
      }
      process.exit(0);
    });

  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();