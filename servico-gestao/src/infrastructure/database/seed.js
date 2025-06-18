const { Database } = require('./database');
const { Plano, Cliente, Assinatura } = require('../../domain/entities/Plano');

async function seedDatabase() {
  const database = new Database();
  const db = database.getDatabase();

  console.log('Iniciando seed do banco de dados...');

  // Limpar dados existentes
  await new Promise((resolve) => {
    db.run("DELETE FROM assinaturas", resolve);
  });
  await new Promise((resolve) => {
    db.run("DELETE FROM clientes", resolve);
  });
  await new Promise((resolve) => {
    db.run("DELETE FROM planos", resolve);
  });

  // Seed de clientes
  const clientes = [
    { codigo: 1001, nome: "João Silva", email: "joao.silva@email.com" },
    { codigo: 1002, nome: "Maria Santos", email: "maria.santos@email.com" },
    { codigo: 1003, nome: "Pedro Oliveira", email: "pedro.oliveira@email.com" },
    { codigo: 1004, nome: "Ana Costa", email: "ana.costa@email.com" },
    { codigo: 1005, nome: "Carlos Ferreira", email: "carlos.ferreira@email.com" },
    { codigo: 1006, nome: "Lucia Almeida", email: "lucia.almeida@email.com" },
    { codigo: 1007, nome: "Roberto Lima", email: "roberto.lima@email.com" },
    { codigo: 1008, nome: "Fernanda Rocha", email: "fernanda.rocha@email.com" },
    { codigo: 1009, nome: "Marcos Pereira", email: "marcos.pereira@email.com" },
    { codigo: 1010, nome: "Juliana Souza", email: "juliana.souza@email.com" }
  ];

  for (const cliente of clientes) {
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO clientes (codigo, nome, email) VALUES (?, ?, ?)",
        [cliente.codigo, cliente.nome, cliente.email],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Seed de planos
  const planos = [
    { 
      codigo: 2001, 
      nome: "Básico", 
      custoMensal: 49.90, 
      data: "2024-01-15",
      descricao: "Internet fibra 100MB + telefone fixo"
    },
    { 
      codigo: 2002, 
      nome: "Intermediário", 
      custoMensal: 79.90, 
      data: "2024-01-15",
      descricao: "Internet fibra 300MB + telefone fixo + TV básica"
    },
    { 
      codigo: 2003, 
      nome: "Avançado", 
      custoMensal: 119.90, 
      data: "2024-01-15",
      descricao: "Internet fibra 600MB + telefone fixo + TV premium + internet móvel 10GB"
    },
    { 
      codigo: 2004, 
      nome: "Premium", 
      custoMensal: 159.90, 
      data: "2024-01-15",
      descricao: "Internet fibra 1GB + telefone fixo + TV premium + internet móvel 30GB"
    },
    { 
      codigo: 2005, 
      nome: "Empresarial", 
      custoMensal: 299.90, 
      data: "2024-01-15",
      descricao: "Internet fibra dedicada 500MB + IP fixo + suporte 24h"
    }
  ];

  for (const plano of planos) {
    await new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO planos (codigo, nome, custo_mensal, data, descricao) VALUES (?, ?, ?, ?, ?)",
        [plano.codigo, plano.nome, plano.custoMensal, plano.data, plano.descricao],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  // Seed de assinaturas
  const hoje = new Date();
  const assinaturas = [
    {
      codigo: 3001,
      codPlano: 2001,
      codCli: 1001,
      inicioFidelidade: "2024-06-01",
      fimFidelidade: "2025-06-01",
      dataUltimoPagamento: "2024-11-01",
      custoFinal: 39.92, // 20% desconto
      descricao: "Desconto de fidelidade aplicado (20% off)"
    },
    {
      codigo: 3002,
      codPlano: 2002,
      codCli: 1002,
      inicioFidelidade: "2024-07-15",
      fimFidelidade: "2025-07-15",
      dataUltimoPagamento: "2024-11-15",
      custoFinal: 63.92,
      descricao: "Desconto de fidelidade aplicado (20% off)"
    },
    {
      codigo: 3003,
      codPlano: 2003,
      codCli: 1003,
      inicioFidelidade: "2024-08-01",
      fimFidelidade: "2025-08-01",
      dataUltimoPagamento: null, // Assinatura inativa
      custoFinal: 95.92,
      descricao: "Desconto de fidelidade aplicado (20% off)"
    },
    {
      codigo: 3004,
      codPlano: 2001,
      codCli: 1004,
      inicioFidelidade: "2024-09-01",
      fimFidelidade: "2025-09-01",
      dataUltimoPagamento: "2024-11-20",
      custoFinal: 39.92,
      descricao: "Desconto de fidelidade aplicado (20% off)"
    },
    {
      codigo: 3005,
      codPlano: 2004,
      codCli: 1005,
      inicioFidelidade: "2024-10-01",
      fimFidelidade: "2025-10-01",
      dataUltimoPagamento: "2024-11-25",
      custoFinal: 127.92,
      descricao: "Desconto de fidelidade aplicado (20% off)"
    }
  ];

  for (const assinatura of assinaturas) {
    await new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO assinaturas 
         (codigo, cod_plano, cod_cli, inicio_fidelidade, fim_fidelidade, 
          data_ultimo_pagamento, custo_final, descricao) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          assinatura.codigo,
          assinatura.codPlano,
          assinatura.codCli,
          assinatura.inicioFidelidade,
          assinatura.fimFidelidade,
          assinatura.dataUltimoPagamento,
          assinatura.custoFinal,
          assinatura.descricao
        ],
        function(err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  console.log('Seed concluído com sucesso!');
  console.log(`- ${clientes.length} clientes inseridos`);
  console.log(`- ${planos.length} planos inseridos`);
  console.log(`- ${assinaturas.length} assinaturas inseridas`);

  database.close();
}

// Executar seed se chamado diretamente
if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };