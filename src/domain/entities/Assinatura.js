class Assinatura {
  constructor(codigo, codPlano, codCli, inicioFidelidade, fimFidelidade, dataUltimoPagamento, custoFinal, descricao) {
    this.codigo = codigo;
    this.codPlano = codPlano;
    this.codCli = codCli;
    this.inicioFidelidade = inicioFidelidade;
    this.fimFidelidade = fimFidelidade;
    this.dataUltimoPagamento = dataUltimoPagamento;
    this.custoFinal = custoFinal;
    this.descricao = descricao;
  }

  static create(codPlano, codCli, custoPlano) {
    const codigo = Date.now();
    const hoje = new Date();
    const inicioFidelidade = hoje.toISOString().split('T')[0];
    
    // Fidelidade de 1 ano (365 dias)
    const fimFidelidade = new Date(hoje.getTime() + (365 * 24 * 60 * 60 * 1000))
      .toISOString().split('T')[0];
    
    // Desconto de 20% durante fidelidade (exemplo)
    const custoFinal = custoPlano * 0.8;
    const descricao = "Desconto de fidelidade aplicado (20% off)";
    
    return new Assinatura(
      codigo, 
      codPlano, 
      codCli, 
      inicioFidelidade, 
      fimFidelidade, 
      null, // dataUltimoPagamento será definido quando houver pagamento
      custoFinal, 
      descricao
    );
  }

  isAtiva() {
    const hoje = new Date();
    const fimFidelidade = new Date(this.fimFidelidade);
    
    // Se não há último pagamento, considera inativa
    if (!this.dataUltimoPagamento) {
      return false;
    }
    
    const ultimoPagamento = new Date(this.dataUltimoPagamento);
    const diasSemPagamento = (hoje - ultimoPagamento) / (1000 * 60 * 60 * 24);
    
    // Máximo 30 dias sem pagamento
    return diasSemPagamento <= 30;
  }

  getStatus() {
    return this.isAtiva() ? 'ATIVO' : 'CANCELADO';
  }

  atualizarPagamento(dataPagamento) {
    this.dataUltimoPagamento = dataPagamento;
  }
}

module.exports = { Assinatura };