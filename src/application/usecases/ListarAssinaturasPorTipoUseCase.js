class ListarAssinaturasPorTipoUseCase {
  constructor(assinaturaRepository) {
    this.assinaturaRepository = assinaturaRepository;
  }

  async execute(tipo) {
    const tiposValidos = ['TODOS', 'ATIVOS', 'CANCELADOS'];
    if (!tiposValidos.includes(tipo)) {
      throw new Error('Tipo inválido. Use: TODOS, ATIVOS ou CANCELADOS');
    }

    const assinaturas = await this.assinaturaRepository.findByTipo(tipo);
    
    return assinaturas.map(assinatura => ({
      codigo: assinatura.codigo,
      codCliente: assinatura.codCli,
      codPlano: assinatura.codPlano,
      dataInicio: assinatura.inicioFidelidade,
      dataFim: assinatura.fimFidelidade,
      status: assinatura.getStatus()
    }));
  }
}

module.exports = { ListarAssinaturasPorTipoUseCase };