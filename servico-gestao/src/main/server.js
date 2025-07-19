require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const { DependencyContainer } = require('../infrastructure/config/dependencyInjection');
const { createGestaoRoutes } = require('../presentation/routes/gestaoRoutes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.dependencyContainer = new DependencyContainer();
    
    this.setupMiddlewares();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Middleware de log
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  setupRoutes() {
    // Rota de health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({ 
        status: 'OK', 
        service: 'ServicoGestao',
        timestamp: new Date().toISOString()
      });
    });

    // Rotas de gestão
    const gestaoController = this.dependencyContainer.getGestaoController();
    const gestaoRoutes = createGestaoRoutes(gestaoController);
    this.app.use('/gestao', gestaoRoutes);

    // Rota para endpoints não encontrados
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint não encontrado',
        message: `A rota ${req.method} ${req.originalUrl} não existe`
      });
    });
  }

  setupErrorHandling() {
    // Middleware global de tratamento de erros
    this.app.use((error, req, res, next) => {
      console.error('Erro não tratado:', error);
      
      res.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Ocorreu um erro inesperado'
      });
    });

    // Tratamento de shutdown graceful
    process.on('SIGTERM', () => {
      console.log('Recebido SIGTERM, fechando servidor...');
      this.close();
    });

    process.on('SIGINT', () => {
      console.log('Recebido SIGINT, fechando servidor...');
      this.close();
    });
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      console.log(`🚀 ServicoGestao rodando na porta ${this.port}`);
      console.log(`📊 Health check disponível em: http://localhost:${this.port}/health`);
      console.log(`📋 Documentação da API disponível no Postman`);
    });
  }

  close() {
    if (this.server) {
      this.server.close(() => {
        console.log('Servidor HTTP fechado');
        this.dependencyContainer.closeDatabase();
        process.exit(0);
      });
    }
  }
}

// Iniciar servidor se executado diretamente
if (require.main === module) {
  const server = new Server();
  server.start();
}

module.exports = { Server };