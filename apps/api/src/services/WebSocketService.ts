import WebSocket, { WebSocketServer } from 'ws';
import { Server } from 'http';
import winston from 'winston';

interface Client {
  ws: WebSocket;
  id: string;
  subscriptions: Set<string>;
  lastPing: Date;
}

interface WebSocketMessage {
  type: string;
  data?: any;
  channel?: string;
}

interface DeploymentUpdate {
  deploymentId: string;
  status: string;
  data: any;
}

interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  service?: string;
}

class WebSocketService {
  private server: Server;
  private wss: WebSocketServer | null;
  private clients: Map<string, Client>;
  private logger: winston.Logger;

  constructor(server: Server) {
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

  initialize(): void {
    this.wss = new WebSocketServer({ 
      server: this.server,
      path: '/ws'
    });

    this.wss.on('connection', (ws: WebSocket, req) => {
      const clientId = this.generateClientId();
      const client: Client = {
        ws,
        id: clientId,
        subscriptions: new Set(),
        lastPing: new Date(),
      };

      this.clients.set(clientId, client);
      this.logger.info(`Client connected: ${clientId}`);

      // Send welcome message
      this.sendToClient(clientId, 'connected', {
        clientId,
        timestamp: new Date().toISOString(),
      });

      ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString()) as WebSocketMessage;
          this.handleClientMessage(clientId, message);
        } catch (error) {
          this.logger.error(`Invalid message from ${clientId}:`, error);
          this.sendToClient(clientId, 'error', {
            message: 'Invalid message format',
          });
        }
      });

      ws.on('pong', () => {
        const client = this.clients.get(clientId);
        if (client) {
          client.lastPing = new Date();
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        this.logger.info(`Client disconnected: ${clientId}`);
      });

      ws.on('error', (error) => {
        this.logger.error(`WebSocket error for ${clientId}:`, error);
        this.clients.delete(clientId);
      });
    });

    // Start heartbeat interval
    setInterval(() => {
      this.clients.forEach((client, clientId) => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.ping();
          
          // Check for stale connections
          const timeSinceLastPing = Date.now() - client.lastPing.getTime();
          if (timeSinceLastPing > 60000) { // 60 seconds
            this.logger.warn(`Removing stale client: ${clientId}`);
            client.ws.terminate();
            this.clients.delete(clientId);
          }
        } else {
          this.clients.delete(clientId);
        }
      });
    }, 30000); // 30 seconds

    this.logger.info('WebSocket server initialized');
  }

  private generateClientId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  private handleClientMessage(clientId: string, data: WebSocketMessage): void {
    this.logger.debug(`Message from ${clientId}:`, data);

    switch (data.type) {
      case 'ping':
        this.sendToClient(clientId, 'pong', { timestamp: new Date().toISOString() });
        break;

      case 'subscribe':
        this.handleSubscription(clientId, data);
        break;

      case 'unsubscribe':
        this.handleUnsubscription(clientId, data);
        break;

      default:
        this.logger.warn(`Unknown message type from ${clientId}: ${data.type}`);
        this.sendToClient(clientId, 'error', {
          message: `Unknown message type: ${data.type}`,
        });
    }
  }

  private handleSubscription(clientId: string, payload: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) {
      this.logger.error(`Client not found: ${clientId}`);
      return;
    }

    const { channel } = payload.data || {};
    if (!channel) {
      this.sendToClient(clientId, 'error', {
        message: 'Channel is required for subscription',
      });
      return;
    }

    client.subscriptions.add(channel);
    this.sendToClient(clientId, 'subscribed', { channel });
    this.logger.info(`Client ${clientId} subscribed to channel: ${channel}`);
  }

  private handleUnsubscription(clientId: string, payload: WebSocketMessage): void {
    const client = this.clients.get(clientId);
    if (!client) {
      this.logger.error(`Client not found: ${clientId}`);
      return;
    }

    const { channel } = payload.data || {};
    if (!channel) {
      this.sendToClient(clientId, 'error', {
        message: 'Channel is required for unsubscription',
      });
      return;
    }

    client.subscriptions.delete(channel);
    this.sendToClient(clientId, 'unsubscribed', { channel });
    this.logger.info(`Client ${clientId} unsubscribed from channel: ${channel}`);
  }

  sendToClient(clientId: string, type: string, data?: any): boolean {
    const client = this.clients.get(clientId);
    if (!client) {
      this.logger.error(`Client not found: ${clientId}`);
      return false;
    }

    if (client.ws.readyState !== WebSocket.OPEN) {
      this.logger.warn(`Client ${clientId} is not connected`);
      this.clients.delete(clientId);
      return false;
    }

    try {
      const message = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };

      client.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      this.logger.error(`Failed to send message to ${clientId}:`, error);
      this.clients.delete(clientId);
      return false;
    }
  }

  broadcast(type: string, data?: any, channel?: string | null): void {
    this.logger.debug(`Broadcasting ${type} to ${channel || 'all clients'}`);

    let clientsToNotify: Client[] = [];

    if (channel) {
      // Send to clients subscribed to specific channel
      clientsToNotify = Array.from(this.clients.values()).filter(client =>
        client.subscriptions.has(channel)
      );
    } else {
      // Send to all clients
      clientsToNotify = Array.from(this.clients.values());
    }

    const message = {
      type,
      data,
      channel,
      timestamp: new Date().toISOString(),
    };

    const messageStr = JSON.stringify(message);
    let successCount = 0;

    clientsToNotify.forEach(client => {
      if (client.ws.readyState === WebSocket.OPEN) {
        try {
          client.ws.send(messageStr);
          successCount++;
        } catch (error) {
          this.logger.error(`Failed to broadcast to client ${client.id}:`, error);
          this.clients.delete(client.id);
        }
      } else {
        this.clients.delete(client.id);
      }
    });

    this.logger.debug(`Broadcast sent to ${successCount}/${clientsToNotify.length} clients`);
  }

  broadcastDeploymentUpdate(deploymentId: string, status: string, data: any): void {
    this.broadcast('deployment_update', {
      deploymentId,
      status,
      ...data,
    }, `deployment:${deploymentId}`);
  }

  broadcastDeploymentLog(deploymentId: string, logEntry: LogEntry): void {
    this.broadcast('deployment_log', {
      deploymentId,
      log: logEntry,
    }, `deployment:${deploymentId}`);
  }

  broadcastProjectUpdate(projectId: string, data: any): void {
    this.broadcast('project_update', {
      projectId,
      ...data,
    }, `project:${projectId}`);
  }

  broadcastSystemAlert(level: string, message: string, data: any = {}): void {
    this.broadcast('system_alert', {
      level,
      message,
      ...data,
    });
  }

  getStats(): any {
    const connectedClients = Array.from(this.clients.values()).filter(
      client => client.ws.readyState === WebSocket.OPEN
    );

    const subscriptions: Record<string, number> = {};
    connectedClients.forEach(client => {
      client.subscriptions.forEach(channel => {
        subscriptions[channel] = (subscriptions[channel] || 0) + 1;
      });
    });

    return {
      totalClients: this.clients.size,
      connectedClients: connectedClients.length,
      subscriptions,
      uptime: process.uptime(),
    };
  }

  getClients(): any[] {
    return Array.from(this.clients.values()).map(client => ({
      id: client.id,
      connected: client.ws.readyState === WebSocket.OPEN,
      subscriptions: Array.from(client.subscriptions),
      lastPing: client.lastPing,
    }));
  }

  close(): void {
    if (this.wss) {
      this.logger.info('Closing WebSocket server...');
      
      this.clients.forEach(client => {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.close(1001, 'Server shutting down');
        }
      });

      this.wss.close(() => {
        this.logger.info('WebSocket server closed');
      });

      this.clients.clear();
      this.wss = null;
    }
  }
}

export default WebSocketService; 