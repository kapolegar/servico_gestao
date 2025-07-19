const NodeCache = require('node-cache');

class InMemoryCache {
  constructor() {
    this.cache = new NodeCache({ 
      stdTTL: parseInt(process.env.CACHE_TTL) || 300,
      checkperiod: 60,
      useClones: false
    });
  }

  async get(key) {
    return this.cache.get(key);
  }

  async set(key, value, ttl) {
    return this.cache.set(key, value, ttl);
  }

  async del(key) {
    return this.cache.del(key);
  }

  async clear() {
    return this.cache.flushAll();
  }

  getStats() {
    return this.cache.getStats();
  }
}

module.exports = InMemoryCache;