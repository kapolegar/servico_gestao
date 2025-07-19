const EventEmitter = require('events');

class MessageBroker extends EventEmitter {
  constructor() {
    super();
    this.topics = new Map();
  }

  async connect() {
    console.log('MessageBroker conectado');
    return true;
  }

  async disconnect() {
    console.log('MessageBroker desconectado');
    this.removeAllListeners();
    return true;
  }

  async publish(topic, message) {
    try {
      console.log(`Publicando mensagem no tópico ${topic}:`, message);
      this.emit(topic, message);
      return true;
    } catch (error) {
      console.error('Erro ao publicar mensagem:', error);
      return false;
    }
  }

  async subscribe(topic, callback) {
    try {
      console.log(`Inscrevendo-se no tópico: ${topic}`);
      this.on(topic, callback);
      return true;
    } catch (error) {
      console.error('Erro ao se inscrever no tópico:', error);
      return false;
    }
  }

  async unsubscribe(topic, callback) {
    try {
      console.log(`Desinscrevendo-se do tópico: ${topic}`);
      this.removeListener(topic, callback);
      return true;
    } catch (error) {
      console.error('Erro ao se desinscrever do tópico:', error);
      return false;
    }
  }
}

module.exports = MessageBroker;