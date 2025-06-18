const Database = require('../infrastructure/database/Database');
const MessageBroker = require('../infrastructure/messaging/MessageBroker');
const PagamentoRepositoryImpl = require('../infrastructure/repositories/PagamentoRepositoryImpl');
const RegistrarPagamento = require('../application/usecases/RegistrarPagamento');
const PagamentoController = require('../presentation/controllers/PagamentoController');

class Container {
  constructor() {
    this._instances = {};
    this._factories = {};
    this.setup();
  }

  setup() {
    // Database
    this.register('database', () => new Database());

    // Message Broker
    this.register('messageBroker', () => new MessageBroker(
      process.env.RABBITMQ_URL || 'amqp://localhost'
    ));

    // Repositories
    this.register('pagamentoRepository', () => 
      new PagamentoRepositoryImpl(this.get('database'))
    );

    // Use Cases
    this.register('registrarPagamentoUseCase', () => 
      new RegistrarPagamento(
        this.get('pagamentoRepository'),
        this.get('messageBroker')
      )
    );

    // Controllers
    this.register('pagamentoController', () => 
      new PagamentoController(this.get('registrarPagamentoUseCase'))
    );
  }

  register(name, factory) {
    this._factories[name] = factory;
  }

  get(name) {
    if (!this._instances[name]) {
      const factory = this._factories[name];
      if (!factory) {
        throw new Error(`Dependência não encontrada: ${name}`);
      }
      this._instances[name] = factory();
    }
    return this._instances[name];
  }
}

module.exports = new Container();