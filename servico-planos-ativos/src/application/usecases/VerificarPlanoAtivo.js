class VerificarPlanoAtivo {
  constructor(cacheManager, httpClient, messageBroker) {
    this.cacheManager = cacheManager;
    this.httpClient = httpClient;
    this.messageBroker = messageBroker;
    this.servicoGestaoUrl = process.env.SERVICO_GESTAO_URL || 'http://localhost:3001';
    this.servicoFaturamentoUrl = process.env.SERVICO_FATURAMENTO_URL || 'http://localhost:3002';
  }

  async execute(clienteId) {
    try {
      const cacheKey = `plano_ativo_${clienteId}`;
      
      // Verificar cache primeiro
      let planoAtivo = await this.cacheManager.get(cacheKey);
      
      if (planoAtivo !== null && planoAtivo !== undefined) {
        console.log(`Plano encontrado no cache para cliente ${clienteId}`);
        return {
          clienteId,
          ativo: planoAtivo.ativo,
          plano: planoAtivo.plano,
          fonte: 'cache'
        };
      }

      // Buscar dados do cliente no serviço de gestão
      const cliente = await this.buscarCliente(clienteId);
      if (!cliente) {
        throw new Error('Cliente não encontrado');
      }

      // Verificar status de pagamento no serviço de faturamento
      const statusPagamento = await this.verificarStatusPagamento(clienteId);

      // Determinar se o plano está ativo
      const ativo = statusPagamento.emDia && cliente.plano && cliente.plano.ativo;

      const resultado = {
        clienteId,
        ativo,
        plano: cliente.plano,
        ultimoPagamento: statusPagamento.ultimoPagamento,
        proximoVencimento: statusPagamento.proximoVencimento
      };

      // Salvar no cache
      await this.cacheManager.set(cacheKey, resultado, 300);

      // Publicar evento se necessário
      if (!ativo) {
        await this.messageBroker.publish('plano.inativo', {
          clienteId,
          motivo: !statusPagamento.emDia ? 'pagamento_pendente' : 'plano_inativo'
        });
      }

      return {
        ...resultado,
        fonte: 'servicos'
      };

    } catch (error) {
      console.error('Erro ao verificar plano ativo:', error);
      throw error;
    }
  }

  async buscarCliente(clienteId) {
    try {
      const url = `${this.servicoGestaoUrl}/clientes/${clienteId}`;
      return await this.httpClient.get(url);
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async verificarStatusPagamento(clienteId) {
    try {
      const url = `${this.servicoFaturamentoUrl}/pagamentos/status/${clienteId}`;
      return await this.httpClient.get(url);
    } catch (error) {
      if (error.response?.status === 404) {
        return { emDia: false, ultimoPagamento: null, proximoVencimento: null };
      }
      throw error;
    }
  }

  async invalidarCache(clienteId) {
    const cacheKey = `plano_ativo_${clienteId}`;
    return await this.cacheManager.del(cacheKey);
  }
}

module.exports = VerificarPlanoAtivo;