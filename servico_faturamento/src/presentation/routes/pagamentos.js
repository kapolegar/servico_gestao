const express = require('express');
const router = express.Router();

router.post('/registrarpagamento', (req, res) => {
  const controller = req.container.pagamentoController;
  controller.registrarPagamento(req, res);
});

module.exports = router;