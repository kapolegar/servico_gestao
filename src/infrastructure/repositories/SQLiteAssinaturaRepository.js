const { IAssinaturaRepository } = require('../../domain/repositories/IAssinaturaRepository');
const { Assinatura } = require('../../domain/entities/Assinatura');

class SQLiteAssinaturaRepository extends IAssinaturaRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM assinaturas", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const assinaturas = rows.map(row => new Assinatura(
            row.codigo,
            row.cod_plano,
            row.cod_cli,
            row.inicio_fidelidade,
            row.fim_fidelidade,
            row.data_ultimo_pagamento,
            row.custo_final,
            row.descricao
          ));
          resolve(assinaturas);
        }
      });
    });
  }

  async findById(codigo) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM assinaturas WHERE codigo = ?", [codigo], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const assinatura = new Assinatura(
            row.codigo,
            row.cod_plano,
            row.cod_cli,
            row.inicio_fidelidade,
            row.fim_fidelidade,
            row.data_ultimo_pagamento,
            row.custo_final,
            row.descricao
          );
          resolve(assinatura);
        } else {
          resolve(null);
        }
      });
    });
  }

  async findByCliente(codCli) {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM assinaturas WHERE cod_cli = ?", [codCli], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const assinaturas = rows.map(row => new Assinatura(
            row.codigo,
            row.cod_plano,
            row.cod_cli,
            row.inicio_fidelidade,
            row.fim_fidelidade,
            row.data_ultimo_pagamento,
            row.custo_final,
            row.descricao
          ));
          resolve(assinaturas);
        }
      });
    });
  }

  async findByPlano(codPlano) {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM assinaturas WHERE cod_plano = ?", [codPlano], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const assinaturas = rows.map(row => new Assinatura(
            row.codigo,
            row.cod_plano,
            row.cod_cli,
            row.inicio_fidelidade,
            row.fim_fidelidade,
            row.data_ultimo_pagamento,
            row.custo_final,
            row.descricao
          ));
          resolve(assinaturas);
        }
      });
    });
  }

  async findByTipo(tipo) {
    let sql = "SELECT * FROM assinaturas";
    let params = [];

    if (tipo === 'ATIVOS') {
      sql += " WHERE data_ultimo_pagamento IS NOT NULL AND datetime(data_ultimo_pagamento, '+30 days') >= datetime('now')";
    } else if (tipo === 'CANCELADOS') {
      sql += " WHERE data_ultimo_pagamento IS NULL OR datetime(data_ultimo_pagamento, '+30 days') < datetime('now')";
    }
    // Para 'TODOS', retorna todas as assinaturas

    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const assinaturas = rows.map(row => new Assinatura(
            row.codigo,
            row.cod_plano,
            row.cod_cli,
            row.inicio_fidelidade,
            row.fim_fidelidade,
            row.data_ultimo_pagamento,
            row.custo_final,
            row.descricao
          ));
          resolve(assinaturas);
        }
      });
    });
  }

  async save(assinatura) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO assinaturas 
                   (codigo, cod_plano, cod_cli, inicio_fidelidade, fim_fidelidade, 
                    data_ultimo_pagamento, custo_final, descricao) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      
      this.db.run(sql, [
        assinatura.codigo,
        assinatura.codPlano,
        assinatura.codCli,
        assinatura.inicioFidelidade,
        assinatura.fimFidelidade,
        assinatura.dataUltimoPagamento,
        assinatura.custoFinal,
        assinatura.descricao
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(assinatura);
        }
      });
    });
  }

  async update(codigo, assinatura) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE assinaturas SET 
                   cod_plano = ?, cod_cli = ?, inicio_fidelidade = ?, fim_fidelidade = ?, 
                   data_ultimo_pagamento = ?, custo_final = ?, descricao = ? 
                   WHERE codigo = ?`;
      
      this.db.run(sql, [
        assinatura.codPlano,
        assinatura.codCli,
        assinatura.inicioFidelidade,
        assinatura.fimFidelidade,
        assinatura.dataUltimoPagamento,
        assinatura.custoFinal,
        assinatura.descricao,
        codigo
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(assinatura);
        }
      });
    });
  }

  async delete(codigo) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM assinaturas WHERE codigo = ?", [codigo], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

module.exports = { SQLiteAssinaturaRepository };