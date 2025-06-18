class PagamentoController {
  constructor(registrarPagamentoUseCase) {
    this.registrarPagamentoUseCase = registrarPagamentoUseCase;
  }

  async registrarPagamento(req, res) {
    try {
      const { dia, mes, ano, codigoAssinatura, valorPago } = req.body;
      
      if (!dia || !mes || !ano || !codigoAssinatura || !valorPago) {
        return res.status(400).json({
          error: 'Dados obrigatórios: dia, mes, ano, codigoAssinatura, valorPago'
        });
      }

      const dataPagamento = `${ano}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      
      await this.registrarPagamentoUseCase.execute(
        codigoAssinatura,
        valorPago,
        dataPagamento
      );
      
      res.status(200).json({
        message: 'Pagamento registrado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        error: error.message
      });
    }
  }
}

module.exports = PagamentoController;