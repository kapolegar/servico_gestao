const axios = require('axios');

class HttpClient {
  constructor() {
    this.client = axios.create({
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`HTTP Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log(`HTTP Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error(`HTTP Error: ${error.response?.status} ${error.config?.url}`);
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config = {}) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config = {}) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url, config = {}) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

module.exports = HttpClient;