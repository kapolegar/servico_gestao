class ListarAssinaturasPorClienteUseCase {
  constructor(assinaturaRepository, clienteRepository) {
    this.assinaturaRepository = assinaturaRepository;
    this.clienteRepository = clienteRepository;
  }

  async execute(codCli) {
    // Validar se cliente existe
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
}

module.exports = { ListarAssinaturasPorClienteUseCase };