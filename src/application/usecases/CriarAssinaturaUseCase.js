const { Assinatura } = require('../../domain/entities/Plano');

class CriarAssinaturaUseCase {
  constructor(assinaturaRepository, planoRepository, clienteRepository) {
    this.assinaturaRepository = assinaturaRepository;
    this.planoRepository = planoRepository;
    this.clienteRepository = clienteRepository;
  }

  async execute(codCli, codPlano) {
    // Validar se cliente existe
    const cliente = await this.clienteRepository.findById(codCli);
    if (!cliente) {
      throw new Error('Cliente não encontrado');
    }

    // Validar se plano existe
    const plano = await this.planoRepository.findById(codPlano);
    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    // Criar assinatura
    const assinatura = Assinatura.create(codPlano, codCli, plano.custoMensal);
    
    // Salvar assinatura
    return await this.assinaturaRepository.save(assinatura);
  }
}

module.exports = { CriarAssinaturaUseCase };