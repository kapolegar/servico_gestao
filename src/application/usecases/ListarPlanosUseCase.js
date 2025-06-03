class ListarPlanosUseCase {
  constructor(planoRepository) {
    this.planoRepository = planoRepository;
  }

  async execute() {
    return await this.planoRepository.findAll();
  }
}

module.exports = { ListarPlanosUseCase };