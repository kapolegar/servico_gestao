class ListarAssinaturasPorPlanoUseCase {
  constructor(assinaturaRepository, planoRepository) {
    this.assinaturaRepository = assinaturaRepository;
    this.planoRepository = planoRepository;
  }

  async execute(codPlano) {
    // Validar se plano existe
    const plano = await this.planoRepository.findById(codPlano);
    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    const assinaturas = await this.assinaturaRepository.findByPlano(codPlano);
    
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

module.exports = { ListarAssinaturasPorPlanoUseCase };
