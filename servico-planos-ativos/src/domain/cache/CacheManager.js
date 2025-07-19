class CacheManager {
  constructor(cacheImplementation) {
    this.cache = cacheImplementation;
  }

  async get(key) {
    try {
      return await this.cache.get(key);
    } catch (error) {
      console.error('Erro ao buscar no cache:', error);
      return null;
    }
  }

  async set(key, value, ttl = 300) {
    try {
      return await this.cache.set(key, value, ttl);
    } catch (error) {
      console.error('Erro ao salvar no cache:', error);
      return false;
    }
  }

  async del(key) {
    try {
      return await this.cache.del(key);
    } catch (error) {
      console.error('Erro ao deletar do cache:', error);
      return false;
    }
  }

  async clear() {
    try {
      return await this.cache.clear();
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
      return false;
    }
  }
}

module.exports = CacheManager;