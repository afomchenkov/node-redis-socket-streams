import { hostname } from 'os';
import { promises as fs } from 'node:fs';
import { createServer } from 'http';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, utilities } from 'nest-winston';
import { format, transports } from 'winston';
import { dump } from 'js-yaml';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server, ServerOptions } from 'socket.io';
import { AppModule } from './app.module';
import { pubClient, subClient } from './redis.config';

const ENV = process.env.NODE_ENV || 'dev';

const setupSwagger = async (app: INestApplication): Promise<void> => {
  const documentBuilder = new DocumentBuilder()
    .setTitle('boards service')
    .setDescription('boards sandbox MS')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, documentBuilder);

  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: 'Swagger documentation',
  });

  // generate new doc in dev mode
  if (process.env.NODE_ENV === 'development') {
    await fs.writeFile('swagger.yaml', dump(document));
  }
};

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    level: ['development'].includes(ENV) ? 'debug' : 'info',
    transports: [
      new transports.Console({
        format: ['development'].includes(ENV)
          ? format.combine(
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
              format.ms(),
              utilities.format.nestLike('Board Service Dev', {
                colors: true,
                prettyPrint: true,
              }),
            )
          : format.printf((msg) => {
              const logFormat = {
                hostname: hostname(),
                app: process.env.APP_NAME,
                environment: process.env.NODE_ENV,
                level: msg.level,
                msg: msg.message,
                product: 'Projects Boards Service',
                time: new Date().toISOString(),
              };

              return JSON.stringify(logFormat);
            }),
      }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
    logger,
  });
  app.enableCors();

  const configService: ConfigService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');

  // Set the global prefix for all routes
  app.setGlobalPrefix('api/v1');

  await app.init(); // initialize before creating the server
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: false,
        exposeDefaultValues: true,
      },
    }),
  );

  // await Promise.all([pubClient.connect(), subClient.connect()]);
  await setupSwagger(app);
  const httpServer = createServer(app.getHttpAdapter().getInstance());

  const serverConfig: Partial<ServerOptions> = {
    cors: {
      origin: '*',
    },
  };
  // Create Redis/Socket events streaming, run on the server port
  const io: Server = new Server(httpServer, serverConfig);
  io.adapter(createAdapter(pubClient, subClient));

  if (logger.debug) {
    logger.debug(`Service started at port: ${port}`);
  }

  httpServer.listen(port);
}
bootstrap();
