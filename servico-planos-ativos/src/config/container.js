const InMemoryCache = require('../domain/cache/InMemoryCache');
const HttpClient = require('../infrastructure/http/HttpClient');
const MessageBroker = require('../infrastructure/messaging/MessageBroker');
const CacheManager = require('../domain/cache/CacheManager');
const VerificarPlanoAtivo = require('../application/usecases/VerificarPlanoAtivo');
const PlanosAtivosController = require('../presentation/controllers/PlanosAtivosController');

class Container {
  constructor() {
    this.services = new Map();
    this.setupServices();
  }

  setupServices() {
    // Infrastructure
    const cache = new InMemoryCache();
    const httpClient = new HttpClient();
    const messageBroker = new MessageBroker();

    // Domain
    const cacheManager = new CacheManager(cache);

    // Application
    const verificarPlanoAtivo = new VerificarPlanoAtivo(
      cacheManager,
      httpClient,
      messageBroker
    );

    // Presentation
    const planosAtivosController = new PlanosAtivosController(verificarPlanoAtivo);

    // Register services
    this.services.set('cache', cache);
    this.services.set('httpClient', httpClient);
    this.services.set('messageBroker', messageBroker);
    this.services.set('cacheManager', cacheManager);
    this.services.set('verificarPlanoAtivo', verificarPlanoAtivo);
    this.services.set('planosAtivosController', planosAtivosController);
  }

  get(serviceName) {
    return this.services.get(serviceName);
  }
}

module.exports = Container;