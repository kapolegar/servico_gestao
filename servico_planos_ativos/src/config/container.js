const CacheManager = require('../domain/cache/CacheManager');
const MessageBroker = require('../infrastructure/messaging/MessageBroker');
const HttpClient = require('../infrastructure/http/HttpClient');
const VerificarPlanoAtivo = require('../application/usecases/VerificarPlanoAtivo');
const PlanosAtivosController = require('../presentation/controllers/PlanosAtivosController');

class Container {
  constructor() {
    this._instances = {};
    this._factories = {};
    this.setup();
  }

  setup() {
    // Cache
    this.register('cache', () => {
      const cache = new CacheManager();
      // Limpeza automática a cada 10 minutos
      setInterval(() => {
        cache.cleanExpired();
      }, 10 * 60 * 1000);
      return cache;
    });

    // HTTP Client
    this.register('httpClient', () => new HttpClient());

    // Message Broker
    this.register('messageBroker', () => new MessageBroker(
      process.env.RABBITMQ_URL || 'amqp://localhost'
    ));

    // Use Cases
    this.register('verificarPlanoAtivoUseCase', () => 
      new VerificarPlanoAtivo(
        this.get('cache'),
        this.get('httpClient')
      )
    );

    // Controllers
    this.register('planosAtivosController', () => 
      new PlanosAtivosController(this.get('verificarPlanoAtivoUseCase'))
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