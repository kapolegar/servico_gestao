class PlanosAtivosController {
  constructor(verificarPlanoAtivo) {
    this.verificarPlanoAtivo = verificarPlanoAtivo;
  }

  async verificarPlano(req, res) {
    try {
      const { clienteId } = req.params;

      if (!clienteId) {
        return res.status(400).json({
          error: 'Cliente ID é obrigatório'
        });
      }

      const resultado = await this.verificarPlanoAtivo.execute(clienteId);

      res.json({
        success: true,
        data: resultado
      });

    } catch (error) {
      console.error('Erro no controller:', error);
      
      if (error.message === 'Cliente não encontrado') {
        return res.status(404).json({
          error: 'Cliente não encontrado'
        });
      }

      res.status(500).json({
        error: 'Erro interno do servidor'
      });
    }
  }

  async invalidarCache(req, res) {
    try {
      const { clienteId } = req.params;

      await this.verificarPlanoAtivo.invalidarCache(clienteId);

      res.json({
        success: true,
        message: 'Cache invalidado com sucesso'
      });

    } catch (error) {
      console.error('Erro ao invalidar cache:', error);
      res.status(500).json({
        error: 'Erro ao invalidar cache'
      });
    }
  }

  async healthCheck(req, res) {
    res.json({
      service: 'servico-planos-ativos',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = PlanosAtivosController;