/**
 * @fileoverview Auth BFF OIDC Template — Initiative Development / Инициативная разработка
 * @author Artyom Pryanishnikov <Pryanishnikovartem@gmail.com>
 * @copyright 2025 Artyom Pryanishnikov
 * @license PolyForm-Shield-1.0.0
 * 
 * INITIATIVE DEVELOPMENT: Created independently, without TZ or direct order.
 * IP rights remain with the Author. Commercial use requires agreement.
 * Contact: Pryanishnikovartem@gmail.com
 */

// src/lib/server/auth/index.ts
/**
 * Production-ready auth configuration
 *
 * По умолчанию используется MemorySessionStore из bff.ts
 * Раскомментируйте код ниже для использования Redis
 */

// ============================================================================
// ВАРИАНТ 1: Memory Store (по умолчанию, только для dev)
// ============================================================================

export { authService } from "./bff.js";

// ============================================================================
// ВАРИАНТ 2: Redis Store (рекомендуется для production)
// ============================================================================
// Чтобы использовать Redis:
// 1. Установите: npm install ioredis
// 2. Добавьте в .env: REDIS_URL=redis://localhost:6379
// 3. Раскомментируйте код ниже и закомментируйте export выше

/*
import { Redis } from 'ioredis';
import { RedisSessionStore } from './stores/redis.js';
import { REDIS_URL } from '$env/static/private';

const redis = new Redis(REDIS_URL || 'redis://localhost:6379', {
  // Настройки для production
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: false,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    console.error('Redis connection error:', err);
    return true;
  }
});

// Логирование состояния Redis
redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('ready', () => console.log('✅ Redis ready'));
redis.on('error', (err) => console.error('❌ Redis error:', err));
redis.on('close', () => console.log('⚠️ Redis connection closed'));
redis.on('reconnecting', () => console.log('🔄 Redis reconnecting...'));

const sessionStore = new RedisSessionStore(redis, {
  prefix: 'session:',
  defaultTTL: 86400 // 24 часа
});

export const authService = new BFFAuthService({
  issuer: OIDC_ISSUER || 'https://your-oidc-provider.com',
  clientId: OIDC_CLIENT_ID || 'your-client-id',
  clientSecret: OIDC_CLIENT_SECRET || 'your-client-secret',
  redirectUri: OIDC_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  scopes: ['openid', 'profile', 'email']
}, sessionStore);

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing Redis connection...');
    await authService.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, closing Redis connection...');
    await authService.shutdown();
    process.exit(0);
  });
}
*/

// ============================================================================
// ВАРИАНТ 3: PostgreSQL Store (если уже используете Postgres)
// ============================================================================
// Чтобы использовать PostgreSQL:
// 1. Установите: npm install pg
// 2. Создайте таблицу (SQL в stores/postgres.ts)
// 3. Добавьте в .env: DATABASE_URL=postgresql://user:pass@localhost:5432/db
// 4. Раскомментируйте код ниже

/*
import { Pool } from 'pg';
import { PostgresSessionStore } from './stores/postgres.js';
import { DATABASE_URL } from '$env/static/private';

const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const sessionStore = new PostgresSessionStore(pool, {
  tableName: 'sessions',
  cleanupIntervalMs: 60 * 60 * 1000 // 1 час
});

export const authService = new BFFAuthService({
  issuer: OIDC_ISSUER || 'https://your-oidc-provider.com',
  clientId: OIDC_CLIENT_ID || 'your-client-id',
  clientSecret: OIDC_CLIENT_SECRET || 'your-client-secret',
  redirectUri: OIDC_REDIRECT_URI || 'http://localhost:5173/auth/callback',
  scopes: ['openid', 'profile', 'email']
}, sessionStore);

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGTERM', async () => {
    console.log('SIGTERM received, closing database connection...');
    await authService.shutdown();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('SIGINT received, closing database connection...');
    await authService.shutdown();
    process.exit(0);
  });
}
*/
