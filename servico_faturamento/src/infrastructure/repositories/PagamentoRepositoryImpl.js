const PagamentoRepository = require('../../domain/repositories/PagamentoRepository');
const Pagamento = require('../../domain/entities/Pagamento');

class PagamentoRepositoryImpl extends PagamentoRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async save(pagamento) {
    const query = `
      INSERT INTO pagamentos (cod_ass, valor_pago, data_pagamento)
      VALUES (?, ?, ?)
    `;
    
    const result = await this.db.run(query, [
      pagamento.codAss,
      pagamento.valorPago,
      pagamento.dataPagamento
    ]);
    
    return new Pagamento(
      result.lastID,
      pagamento.codAss,
      pagamento.valorPago,
      pagamento.dataPagamento
    );
  }

  async findByAssinatura(codAss) {
    const query = `
      SELECT * FROM pagamentos 
      WHERE cod_ass = ? 
      ORDER BY data_pagamento DESC
    `;
    
    const rows = await this.db.all(query, [codAss]);
    
    return rows.map(row => new Pagamento(
      row.codigo,
      row.cod_ass,
      row.valor_pago,
      row.data_pagamento
    ));
  }

  async findAll() {
    const query = 'SELECT * FROM pagamentos ORDER BY data_pagamento DESC';
    const rows = await this.db.all(query);
    
    return rows.map(row => new Pagamento(
      row.codigo,
      row.cod_ass,
      row.valor_pago,
      row.data_pagamento
    ));
  }
}

module.exports = PagamentoRepositoryImpl;