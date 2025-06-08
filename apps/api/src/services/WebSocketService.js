const WebSocket = require('ws');
const winston = require('winston');

class WebSocketService {
  constructor(server) {
    this.server = server;
    this.wss = null;
    this.clients = new Map();
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'websocket.log' }),
      ],
    });
  }

  initialize() {
    try {
      this.wss = new WebSocket.Server({
        server: this.server,
        path: '/ws',
      });

      this.wss.on('connection', (ws, req) => {
        const clientId = this.generateClientId();
        const clientInfo = {
          id: clientId,
          ws,
          ip: req.socket.remoteAddress,
          userAgent: req.headers['user-agent'],
          connectedAt: new Date(),
        };

        this.clients.set(clientId, clientInfo);
        this.logger.info('WebSocket client connected', {
          clientId,
          ip: clientInfo.ip,
          totalClients: this.clients.size,
        });

        // Send welcome message
        this.sendToClient(clientId, 'connection', {
          clientId,
          message: 'Connected to webduh WebSocket server',
          timestamp: new Date(),
        });

        // Handle messages from client
        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message);
            this.handleClientMessage(clientId, data);
          } catch (error) {
            this.logger.error('Invalid WebSocket message from client:', {
              clientId,
              error: error.message,
            });
          }
        });

        // Handle client disconnect
        ws.on('close', () => {
          this.clients.delete(clientId);
          this.logger.info('WebSocket client disconnected', {
            clientId,
            totalClients: this.clients.size,
          });
        });

        // Handle errors
        ws.on('error', (error) => {
          this.logger.error('WebSocket client error:', {
            clientId,
            error: error.message,
          });
          this.clients.delete(clientId);
        });

        // Keep alive ping
        ws.isAlive = true;
        ws.on('pong', () => {
          ws.isAlive = true;
        });
      });

      // Set up ping interval to keep connections alive
      this.pingInterval = setInterval(() => {
        this.wss.clients.forEach((ws) => {
          if (ws.isAlive === false) {
            return ws.terminate();
          }

          ws.isAlive = false;
          ws.ping();
        });
      }, 30000); // 30 seconds

      this.logger.info('WebSocket server initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize WebSocket server:', error);
    }
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  handleClientMessage(clientId, data) {
    try {
      const { type, payload } = data;

      switch (type) {
        case 'subscribe':
          this.handleSubscription(clientId, payload);
          break;
        case 'unsubscribe':
          this.handleUnsubscription(clientId, payload);
          break;
        case 'ping':
          this.sendToClient(clientId, 'pong', { timestamp: new Date() });
          break;
        default:
          this.logger.warn('Unknown message type from client:', {
            clientId,
            type,
          });
      }
    } catch (error) {
      this.logger.error('Error handling client message:', {
        clientId,
        error: error.message,
      });
    }
  }

  handleSubscription(clientId, payload) {
    const client = this.clients.get(clientId);
    if (!client) return;

    if (!client.subscriptions) {
      client.subscriptions = new Set();
    }

    const { channel } = payload;
    client.subscriptions.add(channel);

    this.logger.info('Client subscribed to channel:', { clientId, channel });
    this.sendToClient(clientId, 'subscribed', { channel });
  }

  handleUnsubscription(clientId, payload) {
    const client = this.clients.get(clientId);
    if (!client || !client.subscriptions) return;

    const { channel } = payload;
    client.subscriptions.delete(channel);

    this.logger.info('Client unsubscribed from channel:', {
      clientId,
      channel,
    });
    this.sendToClient(clientId, 'unsubscribed', { channel });
  }

  // Send message to specific client
  sendToClient(clientId, type, data) {
    try {
      const client = this.clients.get(clientId);
      if (!client || client.ws.readyState !== WebSocket.OPEN) return false;

      const message = JSON.stringify({
        type,
        data,
        timestamp: new Date(),
      });

      client.ws.send(message);
      return true;
    } catch (error) {
      this.logger.error('Failed to send message to client:', {
        clientId,
        error: error.message,
      });
      return false;
    }
  }

  // Broadcast message to all connected clients
  broadcast(type, data, channel = null) {
    try {
      const message = JSON.stringify({
        type,
        data,
        channel,
        timestamp: new Date(),
      });

      let sentCount = 0;

      this.clients.forEach((client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          // If channel specified, only send to subscribed clients
          if (
            channel &&
            client.subscriptions &&
            !client.subscriptions.has(channel)
          ) {
            return;
          }

          try {
            client.ws.send(message);
            sentCount++;
          } catch (error) {
            this.logger.error('Failed to send broadcast to client:', {
              clientId,
              error: error.message,
            });
          }
        }
      });

      this.logger.debug('Message broadcasted', { type, channel, sentCount });
      return sentCount;
    } catch (error) {
      this.logger.error('Failed to broadcast message:', error);
      return 0;
    }
  }

  // Deployment-specific methods
  broadcastDeploymentUpdate(deploymentId, status, data) {
    return this.broadcast(
      'deployment-update',
      {
        deploymentId,
        status,
        ...data,
      },
      `deployment:${deploymentId}`,
    );
  }

  broadcastDeploymentLog(deploymentId, logEntry) {
    return this.broadcast(
      'deployment-log',
      {
        deploymentId,
        log: logEntry,
      },
      `deployment:${deploymentId}`,
    );
  }

  broadcastProjectUpdate(projectId, data) {
    return this.broadcast(
      'project-update',
      {
        projectId,
        ...data,
      },
      `project:${projectId}`,
    );
  }

  // System-wide notifications
  broadcastSystemAlert(level, message, data = {}) {
    return this.broadcast('system-alert', {
      level, // info, warning, error
      message,
      ...data,
    });
  }

  // Get connection statistics
  getStats() {
    const stats = {
      totalClients: this.clients.size,
      connectedClients: 0,
      subscriptions: {},
      uptime: process.uptime(),
    };

    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        stats.connectedClients++;

        if (client.subscriptions) {
          client.subscriptions.forEach((channel) => {
            stats.subscriptions[channel] =
              (stats.subscriptions[channel] || 0) + 1;
          });
        }
      }
    });

    return stats;
  }

  // Get client list
  getClients() {
    const clientList = [];

    this.clients.forEach((client, clientId) => {
      clientList.push({
        id: clientId,
        ip: client.ip,
        userAgent: client.userAgent,
        connectedAt: client.connectedAt,
        connected: client.ws.readyState === WebSocket.OPEN,
        subscriptions: client.subscriptions
          ? Array.from(client.subscriptions)
          : [],
      });
    });

    return clientList;
  }

  // Close all connections and cleanup
  close() {
    try {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }

      if (this.wss) {
        this.wss.clients.forEach((ws) => {
          ws.terminate();
        });
        this.wss.close();
        this.wss = null;
      }

      this.clients.clear();
      this.logger.info('WebSocket service closed');
    } catch (error) {
      this.logger.error('Error closing WebSocket service:', error);
    }
  }
}

module.exports = WebSocketService;
