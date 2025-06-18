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
      
      // Configurar exchanges e queues
      await this.setupExchangesAndQueues();
      
      this.logger.info('Conectado ao RabbitMQ');
    } catch (error) {
      this.logger.error('Erro ao conectar ao RabbitMQ:', error);
      throw error;
    }
  }

  async setupExchangesAndQueues() {
    // Exchange para eventos de pagamento
    await this.channel.assertExchange('pagamento-events', 'direct', {
      durable: true
    });

    // Queues para cada serviço
    await this.channel.assertQueue('pagamento-gestao', {
      durable: true
    });

    await this.channel.assertQueue('pagamento-planos-ativos', {
      durable: true
    });

    // Bindings
    await this.channel.bindQueue('pagamento-gestao', 'pagamento-events', 'PagamentoPlanoServicoGestao');
    await this.channel.bindQueue('pagamento-planos-ativos', 'pagamento-events', 'PagamentoPlanoServicoPlanosAtivos');
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

  async subscribe(eventType, callback) {
    try {
      const queueName = eventType === 'PagamentoPlanoServicoGestao' 
        ? 'pagamento-gestao' 
        : 'pagamento-planos-ativos';

      await this.channel.consume(queueName, async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            await callback(content.data);
            this.channel.ack(msg);
            this.logger.info(`Evento processado: ${eventType}`);
          } catch (error) {
            this.logger.error('Erro ao processar evento:', error);
            this.channel.nack(msg, false, false);
          }
        }
      });

      this.logger.info(`Inscrito no evento: ${eventType}`);
    } catch (error) {
      this.logger.error('Erro ao se inscrever no evento:', error);
      throw error;
    }
  }

  async close() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.logger.info('Conexão com RabbitMQ fechada');
  }
}

module.exports = MessageBroker;