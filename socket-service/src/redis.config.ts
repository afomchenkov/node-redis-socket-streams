import { createClient } from 'redis';

export const pubClient = createClient(
  process.env.DOCKER_CONTAINER === 'true'
    ? {
        url: 'redis://redis-service-dev:6379',
      }
    : { url: 'redis://localhost:6379' },
);

export const subClient = pubClient.duplicate();
