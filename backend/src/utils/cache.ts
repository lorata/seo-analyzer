import redis from 'redis';
import { logger } from './logger';

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  logger.error('Redis Client Error', err);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

redisClient.connect().catch((err) => {
  logger.error('Failed to connect Redis', err);
});

export default redisClient;
