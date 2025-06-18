class ListarAssinaturasPorPlanoUseCase {
  constructor(assinaturaRepository, planoRepository) {
    this.assinaturaRepository = assinaturaRepository;
    this.planoRepository = planoRepository;
  }

  async execute(codPlano) {
    // Verificar se código do plano existe
    if (!codPlano) {
            throw new Error('Código do plano é obrigatório');
        }
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

module.exports = { ListarAssinaturasPorPlanoUseCase };
