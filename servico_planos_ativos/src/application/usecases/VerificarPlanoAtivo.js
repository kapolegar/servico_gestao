class VerificarPlanoAtivo {
  constructor(cache, httpClient) {
    this.cache = cache;
    this.httpClient = httpClient;
  }

  async execute(codAss) {
    try {
      // Verificar se está no cache
      const cached = this.cache.get(codAss);
      if (cached !== null) {
        return cached;
      }

      // Consultar o ServicoGestao
      const servicoGestaoUrl = process.env.SERVICO_GESTAO_URL || 'http://localhost:3001';
      const response = await this.httpClient.get(`${servicoGestaoUrl}/gestao/assinatura/${codAss}/ativa`);
      
      const isActive = response.data.ativo;
      
      // Armazenar no cache
      this.cache.set(codAss, isActive);
      
      return isActive;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Assinatura não encontrada
        this.cache.set(codAss, false);
        return false;
      }
      throw new Error(`Erro ao verificar plano ativo: ${error.message}`);
    }
  }
}

module.exports = VerificarPlanoAtivo;