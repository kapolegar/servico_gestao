const amqp = require('amqplib');
const winston = require('winston');

class MessageBroker {
  constructor(connectionUrl = 'amqp://localhost') {
    this.connectionUrl = connectionUrl;
    this.connection = null;
    this.channel = null;
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new winston.transports.Console()
      ]
    });
  }

  async connect() {
    try {
      this.connection = await amqp.connect(this.connectionUrl);
      this.channel = await this.connection.createChannel();
      
      await this.setupExchangesAndQueues();
      
      this.logger.info('MessageBroker conectado - ServicoFaturamento');
    } catch (error) {
      this.logger.error('Erro ao conectar MessageBroker:', error);
      throw error;
    }
  }

  async setupExchangesAndQueues() {
    await this.channel.assertExchange('pagamento-events', 'direct', {
      durable: true
    });
  }

  async publish(eventType, data) {
    try {
      const message = JSON.stringify({
        eventType,
        data,
        timestamp: new Date().toISOString()
      });

      await this.channel.publish(
        'pagamento-events',
        eventType,
        Buffer.from(message),
        { persistent: true }
      );

      this.logger.info(`Evento publicado: ${eventType}`, data);
    } catch (error) {
      this.logger.error('Erro ao publicar evento:', error);
      throw error;
    }
  }

  async close() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

module.exports = MessageBroker;