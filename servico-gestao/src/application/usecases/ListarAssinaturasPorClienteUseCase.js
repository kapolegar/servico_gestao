class ListarAssinaturasPorClienteUseCase {
  constructor(assinaturaRepository, clienteRepository) {
    this.assinaturaRepository = assinaturaRepository;
    this.clienteRepository = clienteRepository;
  }

  async execute(codCli) {
    // Validar se código do cliente existe
    if (!codCli) {
      throw new Error('Código do cliente é obrigatório');
    }

    // Verificar se cliente existe
    const cliente = await this.clienteRepository.findById(codCli);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    const assinaturas = await this.assinaturaRepository.findByCliente(codCli);

    return assinaturas.map(assinatura => ({
      codigo: assinatura.codigo,
      codCliente: assinatura.codCli,
      codPlano: assinatura.codPlano,
      dataInicio: assinatura.inicioFidelidade,
      dataFim: assinatura.fimFidelidade,
      status: assinatura.getStatus()
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

module.exports = { ListarAssinaturasPorClienteUseCase };