class PlanosAtivosController {
  constructor(verificarPlanoAtivoUseCase) {
    this.verificarPlanoAtivoUseCase = verificarPlanoAtivoUseCase;
  }

  async verificarPlanoAtivo(req, res) {
    try {
      const { codass } = req.params;
      
      if (!codass) {
        return res.status(400).json({
          error: 'Código da assinatura é obrigatório'
        });
      }

      const isActive = await this.verificarPlanoAtivoUseCase.execute(codass);
      
      res.json(isActive);
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = PlanosAtivosController;