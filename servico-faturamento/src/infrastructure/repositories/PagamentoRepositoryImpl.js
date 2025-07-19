const { getInstance } = require('../database/database');

class PagamentoRepositoryImpl {
    constructor() {
        this.db = getInstance();
    }

    async salvar(pagamento) {
        try {
            const sql = `
                INSERT INTO pagamentos (
                    cliente_id, valor, data_pagamento, 
                    metodo_pagamento, status, descricao
                ) VALUES (?, ?, ?, ?, ?, ?)
            `;
            
            const params = [
                pagamento.clienteId,
                pagamento.valor,
                pagamento.dataPagamento || new Date().toISOString(),
                pagamento.metodoPagamento,
                pagamento.status || 'pendente',
                pagamento.descricao
            ];

            const result = await this.db.run(sql, params);
            
            // Buscar o pagamento criado
            const pagamentoCriado = await this.buscarPorId(result.id);
            
            console.log('✅ Pagamento salvo:', result.id);
            return pagamentoCriado;
        } catch (error) {
            console.error('❌ Erro ao salvar pagamento:', error);
            throw error;
        }
    }

    async buscarPorId(id) {
        try {
            const sql = 'SELECT * FROM pagamentos WHERE id = ?';
            const rows = await this.db.query(sql, [id]);
            
            if (rows.length === 0) {
                return null;
            }

            return this.mapearPagamento(rows[0]);
        } catch (error) {
            console.error('❌ Erro ao buscar pagamento por ID:', error);
            throw error;
        }
    }

    async buscarPorCliente(clienteId) {
        try {
            const sql = 'SELECT * FROM pagamentos WHERE cliente_id = ? ORDER BY created_at DESC';
            const rows = await this.db.query(sql, [clienteId]);
            
            return rows.map(row => this.mapearPagamento(row));
        } catch (error) {
            console.error('❌ Erro ao buscar pagamentos por cliente:', error);
            throw error;
        }
    }

    async listarTodos(limite = 50, offset = 0) {
        try {
            const sql = 'SELECT * FROM pagamentos ORDER BY created_at DESC LIMIT ? OFFSET ?';
            const rows = await this.db.query(sql, [limite, offset]);
            
            return rows.map(row => this.mapearPagamento(row));
        } catch (error) {
            console.error('❌ Erro ao listar pagamentos:', error);
            throw error;
        }
    }

    async atualizarStatus(id, novoStatus) {
        try {
            const sql = 'UPDATE pagamentos SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
            const result = await this.db.run(sql, [novoStatus, id]);
            
            if (result.changes === 0) {
                throw new Error('Pagamento não encontrado');
            }

            const pagamentoAtualizado = await this.buscarPorId(id);
            console.log('✅ Status do pagamento atualizado:', id);
            return pagamentoAtualizado;
        } catch (error) {
            console.error('❌ Erro ao atualizar status do pagamento:', error);
            throw error;
        }
    }

    async buscarPorPeriodo(dataInicio, dataFim) {
        try {
            const sql = `
                SELECT * FROM pagamentos 
                WHERE data_pagamento BETWEEN ? AND ? 
                ORDER BY data_pagamento DESC
            `;
            const rows = await this.db.query(sql, [dataInicio, dataFim]);
            
            return rows.map(row => this.mapearPagamento(row));
        } catch (error) {
            console.error('❌ Erro ao buscar pagamentos por período:', error);
            throw error;
        }
    }

    async obterEstatisticas() {
        try {
            const sql = `
                SELECT 
                    COUNT(*) as total_pagamentos,
                    SUM(valor) as valor_total,
                    AVG(valor) as valor_medio,
                    COUNT(CASE WHEN status = 'aprovado' THEN 1 END) as aprovados,
                    COUNT(CASE WHEN status = 'pendente' THEN 1 END) as pendentes,
                    COUNT(CASE WHEN status = 'rejeitado' THEN 1 END) as rejeitados
                FROM pagamentos
            `;
            
            const rows = await this.db.query(sql);
            return rows[0];
        } catch (error) {
            console.error('❌ Erro ao obter estatísticas:', error);
            throw error;
        }
    }

    mapearPagamento(row) {
        return {
            id: row.id,
            clienteId: row.cliente_id,
            valor: parseFloat(row.valor),
            dataPagamento: row.data_pagamento,
            metodoPagamento: row.metodo_pagamento,
            status: row.status,
            descricao: row.descricao,
            createdAt: row.created_at,
            updatedAt: row.updated_at
        };
    }

    // Método para verificar saúde do repositório
    async healthCheck() {
        try {
            await this.db.healthCheck();
            return { status: 'healthy', message: 'Repository connection OK' };
        } catch (error) {
            return { status: 'unhealthy', message: error.message };
        }
    }
}

module.exports = PagamentoRepositoryImpl;