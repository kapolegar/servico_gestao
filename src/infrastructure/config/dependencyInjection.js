const { Database } = require('../database/database');
const { SQLitePlanoRepository } = require('../repositories/SQLitePlanoRepository');
const { SQLiteClienteRepository } = require('../repositories/SQLiteClienteRepository');
const { SQLiteAssinaturaRepository } = require('../repositories/SQLiteAssinaturaRepository');

const { ListarClientesUseCase } = require('../../application/usecases/ListarClientesUseCase');
const { ListarPlanosUseCase } = require('../../application/usecases/ListarPlanosUseCase');
const { CriarAssinaturaUseCase } = require('../../application/usecases/CriarAssinaturaUseCase');
const { AtualizarCustoPlanoUseCase } = require('../../application/usecases/AtualizarCustoPlanoUseCase');
const { ListarAssinaturasPorTipoUseCase } = require('../../application/usecases/ListarAssinaturasPorTipoUseCase');
const { ListarAssinaturasPorClienteUseCase } = require('../../application/usecases/ListarAssinaturasPorClienteUseCase');
const { ListarAssinaturasPorPlanoUseCase } = require('../../application/usecases/ListarAssinaturasPorPlanoUseCase');

const { GestaoController } = require('../../presentation/controllers/GestaoController');

class DependencyContainer {
  constructor() {
    this.database = new Database();
    this.setupRepositories();
    this.setupUseCases();
    this.setupControllers();
  }

  setupRepositories() {
    const db = this.database.getDatabase();
    this.planoRepository = new SQLitePlanoRepository(db);
    this.clienteRepository = new SQLiteClienteRepository(db);
    this.assinaturaRepository = new SQLiteAssinaturaRepository(db);
  }

  setupUseCases() {
    this.listarClientesUseCase = new ListarClientesUseCase(this.clienteRepository);
    this.listarPlanosUseCase = new ListarPlanosUseCase(this.planoRepository);
    this.criarAssinaturaUseCase = new CriarAssinaturaUseCase(
      this.assinaturaRepository,
      this.planoRepository,
      this.clienteRepository
    );
    this.atualizarCustoPlanoUseCase = new AtualizarCustoPlanoUseCase(this.planoRepository);
    this.listarAssinaturasPorTipoUseCase = new ListarAssinaturasPorTipoUseCase(
      this.assinaturaRepository
    );
    this.listarAssinaturasPorClienteUseCase = new ListarAssinaturasPorClienteUseCase(
      this.assinaturaRepository,
      this.clienteRepository
    );
    this.listarAssinaturasPorPlanoUseCase = new ListarAssinaturasPorPlanoUseCase(
      this.assinaturaRepository,
      this.planoRepository
    );
  }

  setupControllers() {
    this.gestaoController = new GestaoController(
      this.listarClientesUseCase,
      this.listarPlanosUseCase,
      this.criarAssinaturaUseCase,
      this.atualizarCustoPlanoUseCase,
      this.listarAssinaturasPorTipoUseCase,
      this.listarAssinaturasPorClienteUseCase,
      this.listarAssinaturasPorPlanoUseCase
    );
  }

  getGestaoController() {
    return this.gestaoController;
  }

  closeDatabase() {
    this.database.close();
  }
}

module.exports = { DependencyContainer };