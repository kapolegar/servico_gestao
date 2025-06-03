class AtualizarCustoPlanoUseCase {
  constructor(planoRepository) {
    this.planoRepository = planoRepository;
  }

  async execute(idPlano, novoCusto) {
    const plano = await this.planoRepository.findById(idPlano);
    if (!plano) {
      throw new Error('Plano não encontrado');
    }

    plano.updateCusto(novoCusto);
    return await this.planoRepository.update(idPlano, plano);
  }
}

module.exports = { AtualizarCustoPlanoUseCase };