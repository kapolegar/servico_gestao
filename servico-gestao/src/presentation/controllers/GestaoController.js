class GestaoController {
  constructor(
    listarClientesUseCase,
    listarPlanosUseCase,
    criarAssinaturaUseCase,
    atualizarCustoPlanoUseCase,
    listarAssinaturasPorTipoUseCase,
    listarAssinaturasPorClienteUseCase,
    listarAssinaturasPorPlanoUseCase
  ) {
    this.listarClientesUseCase = listarClientesUseCase;
    this.listarPlanosUseCase = listarPlanosUseCase;
    this.criarAssinaturaUseCase = criarAssinaturaUseCase;
    this.atualizarCustoPlanoUseCase = atualizarCustoPlanoUseCase;
    this.listarAssinaturasPorTipoUseCase = listarAssinaturasPorTipoUseCase;
    this.listarAssinaturasPorClienteUseCase = listarAssinaturasPorClienteUseCase;
    this.listarAssinaturasPorPlanoUseCase = listarAssinaturasPorPlanoUseCase;
  }

  // GET /gestao/clientes
  async listarClientes(req, res) {
    try {
      const clientes = await this.listarClientesUseCase.execute();
      res.status(200).json(clientes);
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  // GET /gestao/planos
  async listarPlanos(req, res) {
    try {
      const planos = await this.listarPlanosUseCase.execute();
      res.status(200).json(planos);
    } catch (error) {
      console.error('Erro ao listar planos:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: error.message 
      });
    }
  }

  // POST /gestao/assinaturas
  async criarAssinatura(req, res) {
    try {
      const { codCli, codPlano } = req.body;

      if (!codCli || !codPlano) {
        return res.status(400).json({
          error: 'Parâmetros obrigatórios',
          message: 'codCli e codPlano são obrigatórios'
        });
      }

      const assinatura = await this.criarAssinaturaUseCase.execute(
        parseInt(codCli), 
        parseInt(codPlano)
      );
      
      res.status(201).json(assinatura);
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      
      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: 'Recurso não encontrado',
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          message: error.message 
        });
      }
    }
  }

  // PATCH /gestao/planos/:idPlano
  async atualizarCustoPlano(req, res) {
    try {
      const { idPlano } = req.params;
      const { custoMensal } = req.body;

      if (!custoMensal || custoMensal <= 0) {
        return res.status(400).json({
          error: 'Parâmetro inválido',
          message: 'custoMensal deve ser um valor positivo'
        });
      }

      const plano = await this.atualizarCustoPlanoUseCase.execute(
        parseInt(idPlano), 
        parseFloat(custoMensal)
      );
      
      res.status(200).json(plano);
    } catch (error) {
      console.error('Erro ao atualizar custo do plano:', error);
      
      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: 'Recurso não encontrado',
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          message: error.message 
        });
      }
    }
  }

  // GET /gestao/assinaturas/:tipo
  async listarAssinaturasPorTipo(req, res) {
    try {
      const { tipo } = req.params;
      const tipoUpper = tipo.toUpperCase();
      
      const assinaturas = await this.listarAssinaturasPorTipoUseCase.execute(tipoUpper);
      res.status(200).json(assinaturas);
    } catch (error) {
      console.error('Erro ao listar assinaturas por tipo:', error);
      
      if (error.message.includes('Tipo inválido')) {
        res.status(400).json({
          error: 'Parâmetro inválido',
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          message: error.message 
        });
      }
    }
  }

  // GET /gestao/assinaturascliente/:codcli
  async listarAssinaturasPorCliente(req, res) {
    try {
      const { codcli } = req.params;
      
      const assinaturas = await this.listarAssinaturasPorClienteUseCase.execute(
        parseInt(codcli)
      );
      
      res.status(200).json(assinaturas);
    } catch (error) {
      console.error('Erro ao listar assinaturas por cliente:', error);
      
      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: 'Recurso não encontrado',
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          message: error.message 
        });
      }
    }
  }

  // GET /gestao/assinaturasplano/:codplano
  async listarAssinaturasPorPlano(req, res) {
    try {
      const { codplano } = req.params;
      
      const assinaturas = await this.listarAssinaturasPorPlanoUseCase.execute(
        parseInt(codplano)
      );
      
      res.status(200).json(assinaturas);
    } catch (error) {
      console.error('Erro ao listar assinaturas por plano:', error);
      
      if (error.message.includes('não encontrado')) {
        res.status(404).json({
          error: 'Recurso não encontrado',
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'Erro interno do servidor',
          message: error.message 
        });
      }
    }
  }
}

module.exports = { GestaoController };