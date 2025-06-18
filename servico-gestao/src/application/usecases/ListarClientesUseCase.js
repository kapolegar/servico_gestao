class ListarClientesUseCase {
  constructor(clienteRepository) {
    this.clienteRepository = clienteRepository;
  }

  async execute() {
    return await this.clienteRepository.findAll();
  }
}

module.exports = { ListarClientesUseCase };