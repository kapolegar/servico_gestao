const express = require('express');

function createPagamentosRoutes(container) {
    const router = express.Router();

    try {
        const pagamentoController = container.get('pagamentoController');

        // Health check específico do módulo
        router.get('/health', (req, res) => pagamentoController.healthCheck(req, res));

        // Criar pagamento
        router.post('/', (req, res) => pagamentoController.criarPagamento(req, res));

        // Listar pagamentos
        router.get('/', (req, res) => pagamentoController.listarPagamentos(req, res));

        // Buscar pagamento por ID
        router.get('/:id', (req, res) => pagamentoController.buscarPagamento(req, res));

        // Atualizar status do pagamento
        router.put('/:id/status', (req, res) => pagamentoController.atualizarStatus(req, res));

        console.log('✅ Rotas de pagamentos configuradas');

    } catch (error) {
        console.error('❌ Erro ao configurar rotas de pagamentos:', error);
        
        // Rota de fallback em caso de erro
        router.use('*', (req, res) => {
            res.status(503).json({
                error: 'Serviço temporariamente indisponível',
                message: 'Erro na configuração das rotas',
                timestamp: new Date().toISOString()
            });
        });
    }

    return router;
}

module.exports = createPagamentosRoutes;