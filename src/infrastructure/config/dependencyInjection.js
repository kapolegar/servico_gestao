const { Database } = require('../database/database');
const { 
  SQLitePlanoRepository, 
  SQLiteClienteRepository, 
  SQLiteAssinaturaRepository 
} = require('../repositories/SQLitePlanoRepository');

const {
  ListarClientesUseCase,
  ListarPlanosUseCase,
  CriarAssinaturaUseCase,
  AtualizarCustoPlanoUseCase,
  ListarAssinaturasPorTipoUseCase,
  ListarAssinaturasPorClienteUseCase,
  ListarAssinaturasPorPlanoUseCase
} = require('../../application/usecases/ListarClientesUseCase');

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