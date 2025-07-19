const express = require('express');
const router = express.Router();
const container = require('../../config/container');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()]
});

// Gerar nova cobrança
router.post('/cobrancas', async (req, res) => {
  try {
    const registrarPagamento = container.resolve('registrarPagamento');
    
    if (!registrarPagamento) {
      return res.status(500).json({
        error: 'Serviço de pagamento não disponível'
      });
    }
    
    const resultado = await registrarPagamento.execute(req.body);
    res.status(201).json(resultado);
    
  } catch (error) {
    logger.error('Erro ao gerar cobrança:', error);
    res.status(500).json({
      error: error.message || 'Erro interno do servidor'
    });
  }
});

// Listar cobranças por assinatura
router.get('/cobrancas/assinatura/:codigoAssinatura', async (req, res) => {
  try {
    const { codigoAssinatura } = req.params;
    const registrarPagamento = container.resolve('registrarPagamento');
    
    if (!registrarPagamento) {
      return res.status(500).json({
        error: 'Serviço de pagamento não disponível'
      });
    }
    
    const cobrancas = await registrarPagamento.buscarCobrancasPorAssinatura(codigoAssinatura);
    res.json(cobrancas);
    
  } catch (error) {
    logger.error('Erro ao buscar cobranças:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Listar todas as cobranças
router.get('/cobrancas', async (req, res) => {
  try {
    const db = container.getDatabase();
    const { status } = req.query;
    
    let query = `
      SELECT codigo, codigo_assinatura as codigoAssinatura, 
             valor_cobrado as valorCobrado, data_vencimento as dataVencimento,
             data_pagamento as dataPagamento, status,
             created_at as createdAt, updated_at as updatedAt
      FROM cobrancas
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status.toUpperCase());
    }
    
    query += ' ORDER BY created_at DESC';
    
    db.all(query, params, (err, rows) => {
      if (err) {
        logger.error('Erro ao buscar cobranças:', err);
        return res.status(500).json({
          error: 'Erro interno do servidor'
        });
      }
      
      res.json(rows);
    });
    
  } catch (error) {
    logger.error('Erro ao buscar cobranças:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Processar pagamento de cobrança
router.patch('/cobrancas/:codigo/pagar', async (req, res) => {
  try {
    const { codigo } = req.params;
    const db = container.getDatabase();
    
    const updateQuery = `
      UPDATE cobrancas 
      SET status = 'PAGA', 
          data_pagamento = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE codigo = ? AND status = 'PENDENTE'
    `;
    
    const dataPagamento = new Date().toISOString().split('T')[0];
    
    db.run(updateQuery, [dataPagamento, codigo], function(err) {
      if (err) {
        logger.error('Erro ao processar pagamento:', err);
        return res.status(500).json({
          error: 'Erro interno do servidor'
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          error: 'Cobrança não encontrada ou já foi paga'
        });
      }
      
      logger.info(`Pagamento processado para cobrança ${codigo}`);
      res.json({
        message: 'Pagamento processado com sucesso',
        codigo: parseInt(codigo),
        dataPagamento,
        status: 'PAGA'
      });
    });
    
  } catch (error) {
    logger.error('Erro ao processar pagamento:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Buscar cobrança específica
router.get('/cobrancas/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const db = container.getDatabase();
    
    const query = `
      SELECT codigo, codigo_assinatura as codigoAssinatura, 
             valor_cobrado as valorCobrado, data_vencimento as dataVencimento,
             data_pagamento as dataPagamento, status,
             created_at as createdAt, updated_at as updatedAt
      FROM cobrancas 
      WHERE codigo = ?
    `;
    
    db.get(query, [codigo], (err, row) => {
      if (err) {
        logger.error('Erro ao buscar cobrança:', err);
        return res.status(500).json({
          error: 'Erro interno do servidor'
        });
      }
      
      if (!row) {
        return res.status(404).json({
          error: 'Cobrança não encontrada'
        });
      }
      
      res.json(row);
    });
    
  } catch (error) {
    logger.error('Erro ao buscar cobrança:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

module.exports = router;