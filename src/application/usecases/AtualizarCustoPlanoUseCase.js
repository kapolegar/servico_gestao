class AtualizarCustoPlanoUseCase {
  constructor(planoRepository) {
    this.planoRepository = planoRepository;
  }

  async execute(idPlano, novoCusto) {
        if (!idPlano) {
            throw new Error('Código do plano é obrigatório');
        }

        if (!novoCusto || novoCusto <= 0) {
            throw new Error('Custo mensal deve ser maior que zero');
        }

        // Buscar plano existente
        const plano = await this.planoRepository.buscarPorCodigo(idPlano);
        if (!plano) {
            throw new Error('Plano não encontrado');
        }

        // Atualizar custo e data de modificação
        plano.custoMensal = novoCusto;
        plano.data = new Date();

        // Salvar alterações
        const planoAtualizado = await this.planoRepository.atualizar(plano);
        
        return planoAtualizado;
    }
}

module.exports = { AtualizarCustoPlanoUseCase };