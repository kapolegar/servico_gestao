const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.isInitialized = false;
    }

    async connect() {
        try {
            // Criar diretório data se não existir
            const dataDir = path.join(__dirname, '../../../data');
            if (!fs.existsSync(dataDir)) {
                fs.mkdirSync(dataDir, { recursive: true });
                console.log('📁 Diretório data criado:', dataDir);
            }

            // Caminho do banco de dados
            const dbPath = path.join(dataDir, 'faturamento.db');
            console.log('🗄️  Conectando ao banco:', dbPath);

            // Criar conexão
            return new Promise((resolve, reject) => {
                this.db = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        console.error('❌ Erro ao conectar SQLite:', err);
                        reject(err);
                    } else {
                        console.log('✅ Conectado ao SQLite:', dbPath);
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error('❌ Erro na conexão do banco:', error);
            throw error;
        }
    }

    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            if (!this.db) {
                await this.connect();
            }

            // Criar tabelas
            await this.createTables();
            this.isInitialized = true;
            console.log('✅ Banco de dados inicializado com sucesso');
        } catch (error) {
            console.error('❌ Erro ao inicializar banco:', error);
            throw error;
        }
    }

    async createTables() {
        return new Promise((resolve, reject) => {
            const createPagamentosTable = `
                CREATE TABLE IF NOT EXISTS pagamentos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    cliente_id INTEGER NOT NULL,
                    valor DECIMAL(10,2) NOT NULL,
                    data_pagamento DATETIME DEFAULT CURRENT_TIMESTAMP,
                    metodo_pagamento VARCHAR(50) NOT NULL,
                    status VARCHAR(20) DEFAULT 'pendente',
                    descricao TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            this.db.run(createPagamentosTable, (err) => {
                if (err) {
                    console.error('❌ Erro ao criar tabela pagamentos:', err);
                    reject(err);
                } else {
                    console.log('✅ Tabela pagamentos criada/verificada');
                    resolve();
                }
            });
        });
    }

    async query(sql, params = []) {
        if (!this.db) {
            await this.initialize();
        }

        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) {
                    console.error('❌ Erro na query:', err);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async run(sql, params = []) {
        if (!this.db) {
            await this.initialize();
        }

        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) {
                    console.error('❌ Erro ao executar comando:', err);
                    reject(err);
                } else {
                    resolve({ 
                        id: this.lastID, 
                        changes: this.changes 
                    });
                }
            });
        });
    }

    async close() {
        if (this.db) {
            return new Promise((resolve, reject) => {
                this.db.close((err) => {
                    if (err) {
                        console.error('❌ Erro ao fechar banco:', err);
                        reject(err);
                    } else {
                        console.log('✅ Conexão do banco fechada');
                        resolve();
                    }
                });
            });
        }
    }

    // Método para verificar se o banco está funcionando
    async healthCheck() {
        try {
            await this.query('SELECT 1 as test');
            return { status: 'healthy', message: 'Database connection OK' };
        } catch (error) {
            return { status: 'unhealthy', message: error.message };
        }
    }
}

// Singleton pattern
let instance = null;

function getInstance() {
    if (!instance) {
        instance = new Database();
    }
    return instance;
}

module.exports = {
    Database,
    getInstance
};