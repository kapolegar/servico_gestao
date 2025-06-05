const { IClienteRepository } = require('../../domain/repositories/IClienteRepository');
const { Cliente } = require('../../domain/entities/Cliente');

class SQLiteClienteRepository extends IClienteRepository {
  constructor(database) {
    super();
    this.db = database;
  }

  async findAll() {
    return new Promise((resolve, reject) => {
      this.db.all("SELECT * FROM clientes", [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const clientes = rows.map(row => new Cliente(
            row.codigo,
            row.nome,
            row.email
          ));
          resolve(clientes);
        }
      });
    });
  }

  async findById(codigo) {
    return new Promise((resolve, reject) => {
      this.db.get("SELECT * FROM clientes WHERE codigo = ?", [codigo], (err, row) => {
        if (err) {
          reject(err);
        } else if (row) {
          const cliente = new Cliente(row.codigo, row.nome, row.email);
          resolve(cliente);
        } else {
          resolve(null);
        }
      });
    });
  }

  async save(cliente) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO clientes (codigo, nome, email) VALUES (?, ?, ?)`;
      
      this.db.run(sql, [cliente.codigo, cliente.nome, cliente.email], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(cliente);
        }
      });
    });
  }

  async update(codigo, cliente) {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE clientes SET nome = ?, email = ? WHERE codigo = ?`;
      
      this.db.run(sql, [cliente.nome, cliente.email, codigo], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(cliente);
        }
      });
    });
  }

  async delete(codigo) {
    return new Promise((resolve, reject) => {
      this.db.run("DELETE FROM clientes WHERE codigo = ?", [codigo], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }
}

module.exports = { SQLiteClienteRepository };