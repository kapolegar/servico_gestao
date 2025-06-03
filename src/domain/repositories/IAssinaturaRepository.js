class IAssinaturaRepository {
  async findAll() {
    throw new Error("Method 'findAll' must be implemented");
  }

  async findById(codigo) {
    throw new Error("Method 'findById' must be implemented");
  }

  async findByCliente(codCli) {
    throw new Error("Method 'findByCliente' must be implemented");
  }

  async findByPlano(codPlano) {
    throw new Error("Method 'findByPlano' must be implemented");
  }

  async findByTipo(tipo) {
    throw new Error("Method 'findByTipo' must be implemented");
  }

  async save(assinatura) {
    throw new Error("Method 'save' must be implemented");
  }

  async update(codigo, assinatura) {
    throw new Error("Method 'update' must be implemented");
  }

  async delete(codigo) {
    throw new Error("Method 'delete' must be implemented");
  }
}

module.exports = { IClienteRepository };