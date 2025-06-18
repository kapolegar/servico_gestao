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
      
      this.logger.info('MessageBroker conectado - ServicoPlanosAtivos');
    } catch (error) {
      this.logger.error('Erro ao conectar MessageBroker:', error);
      throw error;
    }
  }

  async setupExchangesAndQueues() {
    await this.channel.assertExchange('pagamento-events', 'direct', {
      durable: true
    });

    await this.channel.assertQueue('pagamento-planos-ativos', {
      durable: true
    });

    await this.channel.bindQueue(
      'pagamento-planos-ativos', 
      'pagamento-events', 
      'PagamentoPlanoServicoPlanosAtivos'
    );
  }

  async subscribe(eventType, callback) {
    try {
      await this.channel.consume('pagamento-planos-ativos', async (msg) => {
        if (msg) {
          try {
            const content = JSON.parse(msg.content.toString());
            if (content.eventType === eventType) {
              await callback(content.data);
            }
            this.channel.ack(msg);
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
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}

module.exports = MessageBroker;