const axios = require('axios');

class HttpClient {
  constructor() {
    this.client = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async get(url, config = {}) {
    return await this.client.get(url, config);
  }

  async post(url, data, config = {}) {
    return await this.client.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return await this.client.put(url, data, config);
  }

  async delete(url, config = {}) {
    return await this.client.delete(url, config);
  }
}

module.exports = HttpClient;