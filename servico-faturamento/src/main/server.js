const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { getInstance } = require('../config/container');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3002;
        this.container = null;
        this.server = null;
    }

    async initialize() {
        try {
            console.log('🚀 Inicializando Serviço de Faturamento...');

            // Configurar middlewares
            this.setupMiddlewares();

            // Inicializar container
            this.container = getInstance();
            await this.container.initialize();

            // Configurar rotas
            this.setupRoutes();

            // Configurar tratamento de erros
            this.setupErrorHandling();

            console.log('✅ Servidor inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar servidor:', error);
            
            // Tentar continuar com configuração básica
            console.log('🔄 Continuando com configuração básica...');
            this.setupBasicConfiguration();
        }
    }

    setupMiddlewares() {
        // Segurança
        this.app.use(helmet());
        
        // CORS
        this.app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
            credentials: true
        }));

        // Parsing
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));

        // Logging
        this.app.use(morgan('combined'));
    }

    setupRoutes() {
        try {
            // Health check sempre disponível
            this.app.get('/health', async (req, res) => {
                try {
                    let health = {
                        status: 'healthy',
                        service: 'faturamento',
                        timestamp: new Date().toISOString(),
                        version: process.env.npm_package_version || '1.0.0'
                    };

                    if (this.container) {
                        const containerHealth = await this.container.healthCheck();
                        health = { ...health, ...containerHealth };
                    }

                    const statusCode = health.status === 'healthy' ? 200 : 503;
                    res.status(statusCode).json(health);
                } catch (error) {
                    res.status(503).json({
                        status: 'unhealthy',
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });
                }
            });

            // Rotas dos pagamentos (se container estiver disponível)
            if (this.container) {
                const pagamentosRoutes = require('../presentation/routes/pagamentos');
                this.app.use('/api/pagamentos', pagamentosRoutes(this.container));
            }

            // Rota de fallback
            this.app.get('/', (req, res) => {
                res.json({
                    service: 'Serviço de Faturamento',
                    version: '2.0.0',
                    status: 'running',
                    endpoints: [
                        'GET /health - Health check',
                        'POST /api/pagamentos - Registrar pagamento',
                        'GET /api/pagamentos - Listar pagamentos',
                        'GET /api/pagamentos/:id - Buscar pagamento',
                        'PUT /api/pagamentos/:id/status - Atualizar status'
                    ]
                });
            });

        } catch (error) {
            console.error('❌ Erro ao configurar rotas:', error);
        }
    }

    setupBasicConfiguration() {
        // Configuração mínima quando há problemas
        this.app.get('/health', (req, res) => {
            res.status(503).json({
                status: 'degraded',
                service: 'faturamento',
                message: 'Executando em modo básico - problemas com banco de dados',
                timestamp: new Date().toISOString()
            });
        });

        this.app.get('/', (req, res) => {
            res.json({
                service: 'Serviço de Faturamento',
                status: 'degraded',
                message: 'Executando em modo básico'
            });
        });
    }

    setupErrorHandling() {
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Endpoint não encontrado',
                method: req.method,
                path: req.originalUrl
            });
        });

        // Error handler
        this.app.use((error, req, res, next) => {
            console.error('❌ Erro na aplicação:', error);

            res.status(error.status || 500).json({
                error: process.env.NODE_ENV === 'production' 
                    ? 'Erro interno do servidor' 
                    : error.message,
                timestamp: new Date().toISOString()
            });
        });
    }

    async start() {
        try {
            await this.initialize();

            this.server = this.app.listen(this.port, () => {
                console.log(`🚀 Serviço de Faturamento rodando na porta ${this.port}`);
                console.log(`📊 Health check disponível em: http://localhost:${this.port}/health`);
            });

            // Graceful shutdown
            process.on('SIGTERM', () => this.shutdown());
            process.on('SIGINT', () => this.shutdown());

        } catch (error) {
            console.error('❌ Erro ao iniciar servidor:', error);
            process.exit(1);
        }
    }

    async shutdown() {
        console.log('🔄 Finalizando servidor...');

        if (this.server) {
            this.server.close();
        }

        if (this.container) {
            await this.container.shutdown();
        }

        console.log('✅ Servidor finalizado');
        process.exit(0);
    }
}

// Iniciar servidor se executado diretamente
if (require.main === module) {
    const server = new Server();
    server.start();
}

module.exports = Server;