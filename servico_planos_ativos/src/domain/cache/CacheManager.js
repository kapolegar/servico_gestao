class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutos
  }

  set(key, value, ttl = this.ttl) {
    const expirationTime = Date.now() + ttl;
    this.cache.set(key, {
      value,
      expirationTime
    });
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expirationTime) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  remove(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Limpeza automática de itens expirados
  cleanExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expirationTime) {
        this.cache.delete(key);
      }
    }
  }
}

module.exports = CacheManager;