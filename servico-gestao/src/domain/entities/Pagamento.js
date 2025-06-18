class Pagamento {
  constructor(codigo, codAss, valorPago, dataPagamento) {
    this.codigo = codigo;
    this.codAss = codAss;
    this.valorPago = valorPago;
    this.dataPagamento = dataPagamento;
  }

  static create(codAss, valorPago, dataPagamento) {
    const codigo = Date.now();
    return new Pagamento(codigo, codAss, valorPago, dataPagamento);
  }
}

module.exports = { Pagamento };