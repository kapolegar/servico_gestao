class Plano {
  constructor(codigo, nome, custoMensal, data, descricao) {
    this.codigo = codigo;
    this.nome = nome;
    this.custoMensal = custoMensal;
    this.data = data;
    this.descricao = descricao;
  }

  static create(nome, custoMensal, descricao) {
    const codigo = Date.now(); // Simplificado para o exemplo
    const data = new Date().toISOString().split('T')[0];
    return new Plano(codigo, nome, custoMensal, data, descricao);
  }

  updateCusto(novoCusto) {
    this.custoMensal = novoCusto;
    this.data = new Date().toISOString().split('T')[0];
  }
}

module.exports = { Plano };