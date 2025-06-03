// src/infrastructure/repositories/SQLitePlanoRepository.js
const { IPlanoRepository } = require('../../domain/repositories/IPlanoRepository');
const { Plano } = require('../../domain/entities/Plano');

class SQLitePlanoRepository extends IPlanoRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM planos", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const planos = rows.map(row => new Plano(
            row.codigo,
            row.nome,
            row.custo_mensal,
            row.data,
            row.descricao
          ));
          resolve(planos);
        }
      });
    });
  }

  async findById(codigo) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM planos WHERE codigo = ?", [codigo], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const plano = new Plano(
            row.codigo,
            row.nome,
            row.custo_mensal,
            row.data,
            row.descricao
          );
          resolve(plano);
        } else {
          resolve(null);
        }
      });
    });
  }

  async save(plano) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO planos (codigo, nome, custo_mensal, data, descricao) 
                   VALUES (?, ?, ?, ?, ?)`;
      
      this.db.run(sql, [
        plano.codigo,
        plano.nome,
        plano.custoMensal,
        plano.data,
        plano.descricao
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(plano);
        }
      });
    });
  }

  async update(codigo, plano) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE planos SET nome = ?, custo_mensal = ?, data = ?, descricao = ? 
                   WHERE codigo = ?`;
      
      this.db.run(sql, [
        plano.nome,
        plano.custoMensal,
        plano.data,
        plano.descricao,
        codigo
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(plano);
        }
      });
    });
  }

  async delete(codigo) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM planos WHERE codigo = ?", [codigo], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

module.exports = { SQLitePlanoRepository };