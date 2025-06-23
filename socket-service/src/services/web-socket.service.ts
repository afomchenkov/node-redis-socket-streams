import { Injectable, Logger } from '@nestjs/common';
import { Server, Socket, Namespace } from 'socket.io';

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name);
  private namespace: Namespace;

  constructor() {}

  bind(io: Server) {
    this.namespace = io.of(/\/api\/v1$/);

    this.namespace.on('connection', (socket: Socket) =>
      this.onConnection(socket),
    );

    this.namespace.use(
      async (socket: Socket, next: (error?: Error) => void) => {
        const token = socket?.handshake?.headers?.authorization || '';
        this.logger.debug(`[[socket]]: auth ${token}`);
        next();
      },
    );

    setInterval(() => {
      const payload = {
        id: 'something',
        test: [],
      };
      this.broadcast('123', payload);
    }, 2000);
  }

  onConnection(socket: Socket) {
    socket.on('subscribe', (id: string) => {
      this.logger.debug(`[[socket]] subscribe to ${id}`);
      socket.join(id);
    });
    socket.on('unsubscribe', (id: string) => {
      this.logger.debug(`[[socket]] unsubscribe to ${id}`);
      socket.leave(id);
    });
    socket.on('disconnecting', (reason: string) => {
      this.logger.debug(`[[socket]] disconnected ${reason}`);
    });
    this.logger.debug('[[socket]] connected');
  }

  broadcast(id: string, payload: object): void {
    this.logger.debug(`[[socket]] broadcast data to ${id}`);
    this.namespace.to(id).emit('data', {
      ...payload,
      errors: [],
      valid: [],
    });
  }
}
