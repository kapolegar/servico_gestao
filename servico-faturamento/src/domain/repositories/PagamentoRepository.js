class PagamentoRepository {
  async save(pagamento) {
    throw new Error('Método save deve ser implementado');
  }

  async findByAssinatura(codAss) {
    throw new Error('Método findByAssinatura deve ser implementado');
  }

  async findAll() {
    throw new Error('Método findAll deve ser implementado');
  }
}

module.exports = PagamentoRepository;