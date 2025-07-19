const { v4: uuidv4 } = require('uuid');
const https = require('https');
const http = require('http');

class RegistrarPagamento {
    constructor(pagamentoRepository) {
        this.pagamentoRepository = pagamentoRepository;
    }

    async executar(dadosEntrada) {
        try {
            console.log('💰 Registrando novo pagamento...');

            // Validar dados de entrada
            this.validarDados(dadosEntrada);

            // Criar objeto pagamento
            const pagamento = {
                id: uuidv4(),
                clienteId: dadosEntrada.clienteId,
                planoId: dadosEntrada.planoId,
                valor: dadosEntrada.valor,
                status: 'pendente',
                dataVencimento: dadosEntrada.dataVencimento,
                dataPagamento: null,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Salvar no banco
            const pagamentoSalvo = await this.pagamentoRepository.salvar(pagamento);

            // Publicar evento (simulado por enquanto)
            await this.publicarEventoPagamento(pagamentoSalvo);

            console.log('✅ Pagamento registrado com sucesso:', pagamentoSalvo.id);
            return pagamentoSalvo;

        } catch (error) {
            console.error('❌ Erro ao registrar pagamento:', error);
            throw error;
        }
    }

    validarDados(dados) {
        const camposObrigatorios = ['clienteId', 'planoId', 'valor', 'dataVencimento'];
        
        for (const campo of camposObrigatorios) {
            if (!dados[campo]) {
                throw new Error(`Campo obrigatório ausente: ${campo}`);
            }
        }

        if (dados.valor <= 0) {
            throw new Error('Valor deve ser maior que zero');
        }

        // Validar data de vencimento
        const dataVencimento = new Date(dados.dataVencimento);
        if (isNaN(dataVencimento.getTime())) {
            throw new Error('Data de vencimento inválida');
        }
    }

    async publicarEventoPagamento(pagamento) {
        try {
            // Por enquanto, apenas log do evento
            // Futuramente integrar com RabbitMQ
            console.log('📢 Evento publicado: PagamentoRegistrado', {
                id: pagamento.id,
                clienteId: pagamento.clienteId,
                planoId: pagamento.planoId,
                valor: pagamento.valor,
                status: pagamento.status
            });

            // Simular chamada para serviço externo usando fetch nativo do Node.js
            await this.notificarServicoExterno(pagamento);

        } catch (error) {
            console.error('⚠️ Erro ao publicar evento (continuando processamento):', error.message);
            // Não falhar o processo principal por erro de evento
        }
    }

    async notificarServicoExterno(pagamento) {
        return new Promise((resolve, reject) => {
            // Simular notificação HTTP usando módulos nativos
            const postData = JSON.stringify({
                event: 'PagamentoRegistrado',
                data: {
                    id: pagamento.id,
                    clienteId: pagamento.clienteId,
                    valor: pagamento.valor,
                    status: pagamento.status
                }
            });

            // Por enquanto apenas simular - em produção seria uma URL real
            console.log('🔔 Simulando notificação externa:', postData);
            
            // Simular resposta de sucesso
            setTimeout(() => {
                console.log('✅ Notificação externa simulada com sucesso');
                resolve();
            }, 100);
        });
    }

    async buscarPorId(id) {
        try {
            console.log('🔍 Buscando pagamento por ID:', id);
            const pagamento = await this.pagamentoRepository.buscarPorId(id);
            
            if (!pagamento) {
                throw new Error('Pagamento não encontrado');
            }

            return pagamento;
        } catch (error) {
            console.error('❌ Erro ao buscar pagamento:', error);
            throw error;
        }
    }

    async listarTodos() {
        try {
            console.log('📋 Listando todos os pagamentos...');
            return await this.pagamentoRepository.listarTodos();
        } catch (error) {
            console.error('❌ Erro ao listar pagamentos:', error);
            throw error;
        }
    }

    async atualizarStatus(id, novoStatus) {
        try {
            console.log(`🔄 Atualizando status do pagamento ${id} para: ${novoStatus}`);
            
            // Validar status
            const statusValidos = ['pendente', 'pago', 'cancelado', 'vencido'];
            if (!statusValidos.includes(novoStatus)) {
                throw new Error(`Status inválido: ${novoStatus}`);
            }

            const resultado = await this.pagamentoRepository.atualizarStatus(id, novoStatus);

            // Publicar evento de mudança de status
            await this.publicarEventoMudancaStatus(id, novoStatus);

            return resultado;
        } catch (error) {
            console.error('❌ Erro ao atualizar status:', error);
            throw error;
        }
    }

    async publicarEventoMudancaStatus(id, novoStatus) {
        try {
            console.log('📢 Evento publicado: StatusPagamentoAlterado', {
                id,
                novoStatus,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('⚠️ Erro ao publicar evento de mudança de status:', error);
        }
    }
}

module.exports = RegistrarPagamento;