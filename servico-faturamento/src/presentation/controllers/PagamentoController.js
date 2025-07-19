class PagamentoController {
    constructor(registrarPagamento, pagamentoRepository) {
        this.registrarPagamento = registrarPagamento;
        this.pagamentoRepository = pagamentoRepository;
    }

    async criarPagamento(req, res) {
        try {
            console.log('📥 Recebendo solicitação de pagamento:', req.body);

            const dadosEntrada = {
                clienteId: req.body.clienteId,
                planoId: req.body.planoId,
                valor: parseFloat(req.body.valor),
                dataVencimento: req.body.dataVencimento
            };

            const pagamento = await this.registrarPagamento.executar(dadosEntrada);

            res.status(201).json({
                success: true,
                message: 'Pagamento registrado com sucesso',
                data: pagamento
            });

        } catch (error) {
            console.error('❌ Erro no controller ao criar pagamento:', error);
            
            res.status(400).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async buscarPagamento(req, res) {
        try {
            const { id } = req.params;
            console.log('🔍 Buscando pagamento:', id);

            const pagamento = await this.registrarPagamento.buscarPorId(id);

            res.json({
                success: true,
                data: pagamento
            });

        } catch (error) {
            console.error('❌ Erro no controller ao buscar pagamento:', error);
            
            const statusCode = error.message.includes('não encontrado') ? 404 : 500;
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async listarPagamentos(req, res) {
        try {
            console.log('📋 Listando pagamentos...');

            const pagamentos = await this.registrarPagamento.listarTodos();

            res.json({
                success: true,
                data: pagamentos,
                total: pagamentos.length
            });

        } catch (error) {
            console.error('❌ Erro no controller ao listar pagamentos:', error);
            
            res.status(500).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            console.log(`🔄 Atualizando status do pagamento ${id} para: ${status}`);

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: 'Status é obrigatório'
                });
            }

            const resultado = await this.registrarPagamento.atualizarStatus(id, status);

            res.json({
                success: true,
                message: 'Status atualizado com sucesso',
                data: resultado
            });

        } catch (error) {
            console.error('❌ Erro no controller ao atualizar status:', error);
            
            const statusCode = error.message.includes('não encontrado') ? 404 : 400;
            
            res.status(statusCode).json({
                success: false,
                message: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }

    async healthCheck(req, res) {
        try {
            const health = {
                status: 'healthy',
                service: 'faturamento-controller',
                timestamp: new Date().toISOString(),
                endpoints: {
                    'POST /': 'Criar pagamento',
                    'GET /': 'Listar pagamentos',
                    'GET /:id': 'Buscar pagamento',
                    'PUT /:id/status': 'Atualizar status'
                }
            };

            // Testar repositório
            if (this.pagamentoRepository) {
                const repoHealth = await this.pagamentoRepository.healthCheck();
                health.repository = repoHealth;
                
                if (repoHealth.status === 'unhealthy') {
                    health.status = 'degraded';
                }
            }

            const statusCode = health.status === 'healthy' ? 200 : 503;
            res.status(statusCode).json(health);

        } catch (error) {
            console.error('❌ Erro no health check do controller:', error);
            
            res.status(503).json({
                status: 'unhealthy',
                service: 'faturamento-controller',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = PagamentoController;