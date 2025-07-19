const { getInstance } = require('../infrastructure/database/database');
const PagamentoRepositoryImpl = require('../infrastructure/repositories/PagamentoRepositoryImpl');
const RegistrarPagamento = require('../application/usecases/RegistrarPagamento');
const PagamentoController = require('../presentation/controllers/PagamentoController');

class Container {
    constructor() {
        this.services = new Map();
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log('🔧 Inicializando container...');

            // Inicializar banco de dados
            const database = getInstance();
            await database.initialize();
            this.services.set('database', database);

            // Repositórios
            const pagamentoRepository = new PagamentoRepositoryImpl();
            this.services.set('pagamentoRepository', pagamentoRepository);

            // Use cases
            const registrarPagamento = new RegistrarPagamento(pagamentoRepository);
            this.services.set('registrarPagamento', registrarPagamento);

            // Controllers
            const pagamentoController = new PagamentoController(
                registrarPagamento,
                pagamentoRepository
            );
            this.services.set('pagamentoController', pagamentoController);

            this.isInitialized = true;
            console.log('✅ Container inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar container:', error);
            throw error;
        }
    }

    get(serviceName) {
        if (!this.isInitialized) {
            throw new Error('Container não foi inicializado. Chame initialize() primeiro.');
        }

        const service = this.services.get(serviceName);
        if (!service) {
            throw new Error(`Serviço '${serviceName}' não encontrado no container`);
        }

        return service;
    }

    has(serviceName) {
        return this.services.has(serviceName);
    }

    async healthCheck() {
        const health = {
            status: 'healthy',
            services: {},
            timestamp: new Date().toISOString()
        };

        try {
            // Verificar banco de dados
            const database = this.services.get('database');
            if (database) {
                health.services.database = await database.healthCheck();
            }

            // Verificar repositório
            const pagamentoRepository = this.services.get('pagamentoRepository');
            if (pagamentoRepository) {
                health.services.repository = await pagamentoRepository.healthCheck();
            }

            // Determinar status geral
            const hasUnhealthy = Object.values(health.services).some(
                service => service.status === 'unhealthy'
            );

            if (hasUnhealthy) {
                health.status = 'unhealthy';
            }

        } catch (error) {
            health.status = 'unhealthy';
            health.error = error.message;
        }

        return health;
    }

    async shutdown() {
        try {
            console.log('🔄 Finalizando container...');

            // Fechar conexão do banco
            const database = this.services.get('database');
            if (database) {
                await database.close();
            }

            this.services.clear();
            this.isInitialized = false;
            console.log('✅ Container finalizado');
        } catch (error) {
            console.error('❌ Erro ao finalizar container:', error);
        }
    }
}

// Singleton pattern
let containerInstance = null;

function getContainerInstance() {
    if (!containerInstance) {
        containerInstance = new Container();
    }
    return containerInstance;
}

module.exports = {
    Container,
    getInstance: getContainerInstance
};