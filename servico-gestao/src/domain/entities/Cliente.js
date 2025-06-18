class Cliente {
  constructor(codigo, nome, email) {
    this.codigo = codigo;
    this.nome = nome;
    this.email = email;
  }

  static create(nome, email) {
    const codigo = Date.now();
    return new Cliente(codigo, nome, email);
  }
}

module.exports = { Cliente };