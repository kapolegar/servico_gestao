class IClienteRepository {
  async findAll() {
    throw new Error("Method 'findAll' must be implemented");
  }

  async findById(codigo) {
    throw new Error("Method 'findById' must be implemented");
  }

  async save(cliente) {
    throw new Error("Method 'save' must be implemented");
  }

  async update(codigo, cliente) {
    throw new Error("Method 'update' must be implemented");
  }

  async delete(codigo) {
    throw new Error("Method 'delete' must be implemented");
  }
}

module.exports = { IAssinaturaRepository };