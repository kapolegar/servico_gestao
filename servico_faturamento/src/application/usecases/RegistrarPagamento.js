class RegistrarPagamento {
  constructor(pagamentoRepository, messageBroker) {
    this.pagamentoRepository = pagamentoRepository;
    this.messageBroker = messageBroker;
  }

  async execute(codAss, valorPago, dataPagamento) {
    try {
      const Pagamento = require('../../domain/entities/Pagamento');
      
      // Criar o pagamento
      const pagamento = Pagamento.create(codAss, valorPago, dataPagamento);
      
      // Salvar no banco
      const pagamentoSalvo = await this.pagamentoRepository.save(pagamento);
      
      // Publicar eventos
      const eventoGestao = {
        codAss: codAss,
        valorPago: valorPago,
        dataPagamento: dataPagamento,
        timestamp: new Date().toISOString()
      };

      const eventoPlanosAtivos = {
        codAss: codAss,
        valorPago: valorPago,
        dataPagamento: dataPagamento,
        timestamp: new Date().toISOString()
      };

      await this.messageBroker.publish('PagamentoPlanoServicoGestao', eventoGestao);
      await this.messageBroker.publish('PagamentoPlanoServicoPlanosAtivos', eventoPlanosAtivos);
      
      return pagamentoSalvo;
    } catch (error) {
      throw new Error(`Erro ao registrar pagamento: ${error.message}`);
    }
  }
}

module.exports = RegistrarPagamento;