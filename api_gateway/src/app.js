const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const httpProxy = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');
const winston = require('winston');

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
    new winston.transports.File({ filename: 'logs/gateway.log' })
  ]
});

// Middlewares de segurança e performance
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por windowMs
  message: {
    error: 'Muitas requisições, tente novamente em 15 minutos'
  }
});
app.use(limiter);

// Middleware de logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Configuração dos serviços
const services = {
  gestao: {
    url: process.env.SERVICO_GESTAO_URL || 'http://localhost:3001',
    path: '/gestao'
  },
  faturamento: {
    url: process.env.SERVICO_FATURAMENTO_URL || 'http://localhost:3002',
    path: '/faturamento'
  },
  planosativos: {
    url: process.env.SERVICO_PLANOS_ATIVOS_URL || 'http://localhost:3003',
    path: '/planosativos'
  }
};

// Middleware para service discovery
const createProxyOptions = (service) => ({
  target: service.url,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    const newPath = path.replace(service.path, '');
    logger.info(`Redirecionando: ${path} -> ${service.url}${newPath}`);
    return newPath;
  },
  onError: (err, req, res) => {
    logger.error('Erro no proxy:', err.message);
    res.status(503).json({
      error: 'Serviço temporariamente indisponível',
      service: service.url
    });
  },
  onProxyReq: (proxyReq, req, res) => {
    logger.info(`Proxy request: ${req.method} ${req.url} -> ${service.url}`);
  }
});

// Configuração das rotas proxy
app.use('/gestao', httpProxy(createProxyOptions(services.gestao)));
app.use('/faturamento', httpProxy(createProxyOptions(services.faturamento)));
app.use('/planosativos', httpProxy(createProxyOptions(services.planosativos)));

// Health check do gateway
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'API Gateway',
    timestamp: new Date().toISOString(),
    services: {
      gestao: services.gestao.url,
      faturamento: services.faturamento.url,
      planosativos: services.planosativos.url
    }
  });
});

// Health check agregado de todos os serviços
app.get('/health/services', async (req, res) => {
  const axios = require('axios');
  const results = {};
  
  for (const [name, service] of Object.entries(services)) {
    try {
      const response = await axios.get(`${service.url}/health`, { timeout: 5000 });
      results[name] = {
        status: 'UP',
        url: service.url,
        response: response.data
      };
    } catch (error) {
      results[name] = {
        status: 'DOWN',
        url: service.url,
        error: error.message
      };
    }
  }
  
  const allHealthy = Object.values(results).every(r => r.status === 'UP');
  
  res.status(allHealthy ? 200 : 503).json({
    gateway: 'UP',
    services: results,
    timestamp: new Date().toISOString()
  });
});

// Rota 404
app.use('*', (req, res) => {
  logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({
    error: 'Rota não encontrada',
    method: req.method,
    url: req.originalUrl
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`API Gateway rodando na porta ${PORT}`);
  logger.info('Serviços configurados:', services);
});

module.exports = app;