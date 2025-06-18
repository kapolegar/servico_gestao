const express = require('express');
const router = express.Router();

function createGestaoRoutes(gestaoController) {
  // GET /gestao/clientes
  router.get('/clientes', async (req, res) => {
    await gestaoController.listarClientes(req, res);
  });

  // GET /gestao/planos
  router.get('/planos', async (req, res) => {
    await gestaoController.listarPlanos(req, res);
  });

  // PATCH /gestao/planos/:idPlano
  router.patch('/planos/:idPlano', async (req, res) => {
    await gestaoController.atualizarCustoPlano(req, res);
  });

  // POST /gestao/assinaturas
  router.post('/assinaturas', async (req, res) => {
    await gestaoController.criarAssinatura(req, res);
  });

  // GET /gestao/assinaturas/:tipo
  router.get('/assinaturas/:tipo', async (req, res) => {
    await gestaoController.listarAssinaturasPorTipo(req, res);
  });

  // GET /gestao/assinaturascliente/:codcli
  router.get('/assinaturascliente/:codcli', async (req, res) => {
    await gestaoController.listarAssinaturasPorCliente(req, res);
  });

  // GET /gestao/assinaturasplano/:codplano
  router.get('/assinaturasplano/:codplano', async (req, res) => {
    await gestaoController.listarAssinaturasPorPlano(req, res);
  });

  return router;
}

module.exports = { createGestaoRoutes };