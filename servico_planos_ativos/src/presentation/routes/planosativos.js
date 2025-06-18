const express = require('express');
const router = express.Router();

router.get('/planosativos/:codass', (req, res) => {
  const controller = req.container.planosAtivosController;
  controller.verificarPlanoAtivo(req, res);
});

module.exports = router;
