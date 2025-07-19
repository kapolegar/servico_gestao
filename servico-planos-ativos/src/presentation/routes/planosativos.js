const express = require('express');
const router = express.Router();

function createPlanosAtivosRoutes(container) {
  const controller = container.get('planosAtivosController');

  router.get('/health', (req, res) => controller.healthCheck(req, res));
  router.get('/verificar/:clienteId', (req, res) => controller.verificarPlano(req, res));
  router.delete('/cache/:clienteId', (req, res) => controller.invalidarCache(req, res));

  return router;
}

module.exports = createPlanosAtivosRoutes;