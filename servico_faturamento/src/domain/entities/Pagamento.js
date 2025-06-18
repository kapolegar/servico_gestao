class Pagamento {
  constructor(codigo, codAss, valorPago, dataPagamento) {
    this.codigo = codigo;
    this.codAss = codAss;
    this.valorPago = valorPago;
    this.dataPagamento = dataPagamento;
  }

  static create(codAss, valorPago, dataPagamento) {
    if (!codAss || valorPago <= 0 || !dataPagamento) {
      throw new Error('Dados inválidos para criar pagamento');
    }

    return new Pagamento(
      null, // será gerado pelo banco
      codAss,
      valorPago,
      dataPagamento
    );
  }

  toJSON() {
    return {
      codigo: this.codigo,
      codAss: this.codAss,
      valorPago: this.valorPago,
      dataPagamento: this.dataPagamento
    };
  }
}

module.exports = Pagamento;