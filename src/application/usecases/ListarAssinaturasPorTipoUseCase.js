class ListarAssinaturasPorTipoUseCase {
  constructor(assinaturaRepository) {
    this.assinaturaRepository = assinaturaRepository;
  }

  async execute(tipo) {
    const tiposValidos = ['TODOS', 'ATIVOS', 'CANCELADOS'];

    if (!tiposValidos.includes(tipo)) {
      throw new Error('Tipo deve ser: TODOS, ATIVOS ou CANCELADOS');
    }

    const assinaturas = await this.assinaturaRepository.findByTipo(tipo);

    return assinaturas.map(assinatura => ({
      codigoAssinatura: assinatura.codigo,
      codigoCliente: assinatura.codCli,
      codigoPlano: assinatura.codPlano,
      dataInicio: assinatura.inicioFidelidade,
      dataFim: assinatura.fimFidelidade,
      status: this._determinarStatus(assinatura)
    }));
  }

  _determinarStatus(assinatura) {
    const agora = new Date();
    const dataUltimoPagamento = new Date(assinatura.dataUltimoPagamento);
    const diasSemPagamento = Math.floor((agora - dataUltimoPagamento) / (1000 * 60 * 60 * 24));

    // Se passou mais de 30 dias sem pagamento, está cancelado
    if (diasSemPagamento > 30) {
      return 'CANCELADO';
    }

    return 'ATIVO';
  }
}

module.exports = { ListarAssinaturasPorTipoUseCase };