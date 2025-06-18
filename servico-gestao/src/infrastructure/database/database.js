const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, 'sistema_planos.db');
    this.db = new sqlite3.Database(dbPath);
    this.initTables();
  }

  initTables() {
    // Criar tabela de clientes
    this.db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        codigo INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      )
    `);

    // Criar tabela de planos
    this.db.run(`
      CREATE TABLE IF NOT EXISTS planos (
        codigo INTEGER PRIMARY KEY,
        nome TEXT NOT NULL,
        custo_mensal REAL NOT NULL,
        data TEXT NOT NULL,
        descricao TEXT
      )
    `);

    // Criar tabela de assinaturas
    this.db.run(`
      CREATE TABLE IF NOT EXISTS assinaturas (
        codigo INTEGER PRIMARY KEY,
        cod_plano INTEGER NOT NULL,
        cod_cli INTEGER NOT NULL,
        inicio_fidelidade TEXT NOT NULL,
        fim_fidelidade TEXT NOT NULL,
        data_ultimo_pagamento TEXT,
        custo_final REAL NOT NULL,
        descricao TEXT,
        FOREIGN KEY (cod_plano) REFERENCES planos (codigo),
        FOREIGN KEY (cod_cli) REFERENCES clientes (codigo)
      )
    `);

    // Criar tabela de pagamentos (para futuras fases)
    this.db.run(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        codigo INTEGER PRIMARY KEY,
        cod_ass INTEGER NOT NULL,
        valor_pago REAL NOT NULL,
        data_pagamento TEXT NOT NULL,
        FOREIGN KEY (cod_ass) REFERENCES assinaturas (codigo)
      )
    `);
  }

  getDatabase() {
    return this.db;
  }

  close() {
    this.db.close();
  }
}

module.exports = { Database };