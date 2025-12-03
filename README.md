<div align="center">

# 🔐 Auth BFF OIDC Template

[![License](https://img.shields.io/badge/License-PolyForm%20Shield-red.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Artyom%20Pryanishnikov-purple.svg)](https://github.com/FrankFMY)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2-FF3E00.svg?logo=svelte)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org/)

**Production-ready SvelteKit template for OAuth/OIDC authentication using the Backend-for-Frontend (BFF) pattern**

[🚀 Быстрый старт](#-quick-start) • [📖 Документация](#-project-structure) • [📄 Лицензия](#-legal--license)

</div>

---

## ✨ Features

| Функция | Описание |
|---------|----------|
| **🔒 Secure by Design** | Токены никогда не покидают сервер, только HTTP-only cookies в браузере |
| **⚡ PKCE Flow** | Защита от перехвата authorization code |
| **📦 Гибкое хранение сессий** | Memory (dev), Redis (prod), PostgreSQL |
| **🛡️ Rate Limiting** | Встроенная защита от brute-force атак |
| **🎯 Type-Safe** | Полная поддержка TypeScript с типами SvelteKit |
| **🚀 Svelte 5** | Современные реактивные паттерны с runes |
| **🔄 Token Refresh** | Автоматическое обновление токенов перед истечением |
| **🧹 Session Cleanup** | Автоматическая очистка истекших сессий |
| **🍪 HTTP-Only Cookies** | Безопасное хранение сессий |
| **🛡️ CSRF Protection** | Встроенная защита от CSRF атак |

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- [pnpm](https://pnpm.io/) >= 9.0.0 (или npm/yarn)
- OAuth/OIDC Provider (Keycloak, Auth0, Okta, Google, Microsoft и т.д.)
- (Опционально) Redis или PostgreSQL для production сессий

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/FrankFMY/auth-bff-oidc-template.git
cd auth-bff-oidc-template
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create `.env` file in the project root:

```env
# OIDC Configuration
OIDC_ISSUER=https://your-oidc-provider.com
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URI=http://localhost:5173/auth/callback

# Session Configuration (optional)
# SESSION_SECRET=your-random-secret-key
```

### 4. Run the development server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Session Store Configuration

### Development: Memory Store (Default)

No additional setup required. Memory store is used by default.

⚠️ **Warning**: Memory store is NOT suitable for production. Sessions are lost on server restart.

### Production: Redis Store (Recommended)

1. Install Redis client:

```bash
pnpm add ioredis
```

2. Add Redis URL to `.env`:

```env
REDIS_URL=redis://localhost:6379
```

3. Edit `src/lib/server/auth/index.ts` and uncomment Redis configuration:

```typescript
// Uncomment this section
import { Redis } from "ioredis";
import { RedisSessionStore } from "./stores/redis.js";
import { REDIS_URL } from "$env/static/private";

const redis = new Redis(REDIS_URL || "redis://localhost:6379");
const sessionStore = new RedisSessionStore(redis);

export const authService = new BFFAuthService(
  {
    issuer: OIDC_ISSUER,
    clientId: OIDC_CLIENT_ID,
    clientSecret: OIDC_CLIENT_SECRET,
    redirectUri: OIDC_REDIRECT_URI,
    scopes: ["openid", "profile", "email"],
  },
  sessionStore,
);
```

### Production: PostgreSQL Store

1. Install PostgreSQL client:

```bash
pnpm add pg
```

2. Create sessions table:

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  expires_at BIGINT NOT NULL
);

CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

3. Add Database URL to `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

4. Edit `src/lib/server/auth/index.ts` and uncomment PostgreSQL configuration.

## 🏗️ Project Structure

```
src/
├── lib/
│   └── server/
│       └── auth/
│           ├── bff.ts              # Core BFF Auth Service
│           ├── index.ts            # Auth configuration
│           ├── middleware.ts       # Authentication middleware
│           ├── rate-limiter.ts     # Rate limiting
│           ├── session-store.ts    # Session store interface
│           ├── utils.ts            # Utility functions
│           └── stores/
│               ├── memory.ts       # Memory session store
│               ├── redis.ts        # Redis session store
│               └── postgres.ts     # PostgreSQL session store
├── routes/
│   ├── +layout.server.ts          # User data injection
│   ├── +page.svelte               # Home page
│   ├── auth/
│   │   ├── login/+server.ts       # Login endpoint
│   │   ├── callback/+server.ts    # OAuth callback
│   │   └── logout/+server.ts      # Logout endpoint
│   └── api/
│       └── user/
│           └── profile/+server.ts # Protected API example
└── hooks.server.ts                # Global hooks (auth middleware)
```

## 🛠️ Technology Stack

### Frontend

| Технология | Версия | Назначение |
|------------|--------|------------|
| [SvelteKit](https://kit.svelte.dev/) | 2.x | Fullstack фреймворк |
| [Svelte 5](https://svelte.dev/) | 5.x | UI библиотека с Runes |
| [TypeScript](https://www.typescriptlang.org/) | 5.9+ | Типизация |
| [Vite](https://vitejs.dev/) | 7.x | Сборщик и dev server |

### Backend

| Технология | Версия | Назначение |
|------------|--------|------------|
| [SvelteKit](https://kit.svelte.dev/) | 2.x | Backend API routes |
| [Node.js](https://nodejs.org/) | 20+ | JavaScript runtime |

### Session Storage

| Технология | Назначение |
|------------|------------|
| **Memory Store** | Development (in-memory) |
| [Redis](https://redis.io/) | Production sessions (через ioredis) |
| [PostgreSQL](https://www.postgresql.org/) | Production sessions (через pg) |

### Development Tools

| Технология | Назначение |
|------------|------------|
| [pnpm](https://pnpm.io/) | Package manager |
| [ESLint](https://eslint.org/) | Линтинг кода |
| [Prettier](https://prettier.io/) | Форматирование кода |
| [tsx](https://github.com/esbuild-kit/tsx) | TypeScript execution |

---

## 🔐 Authentication Flow

```mermaid
sequenceDiagram
    participant Browser
    participant BFF (SvelteKit)
    participant OIDC Provider

    Browser->>BFF: GET /auth/login
    BFF->>BFF: Generate PKCE challenge
    BFF->>OIDC Provider: Redirect to authorization URL
    OIDC Provider->>Browser: Login page
    Browser->>OIDC Provider: Enter credentials
    OIDC Provider->>BFF: Redirect to /auth/callback?code=...
    BFF->>OIDC Provider: Exchange code for tokens (with PKCE)
    OIDC Provider->>BFF: Return tokens
    BFF->>BFF: Store tokens in session
    BFF->>Browser: Set HTTP-only cookie, redirect to /
    Browser->>BFF: GET / (with cookie)
    BFF->>BFF: Validate session
    BFF->>Browser: Return protected page
```

## 🛡️ Security Features

| Функция | Реализация |
|---------|------------|
| **Токены не покидают сервер** | Access/refresh токены хранятся только на сервере |
| **HTTP-Only Cookies** | Session IDs в безопасных HTTP-only cookies |
| **PKCE** | Защита от перехвата authorization code |
| **Rate Limiting** | Настраиваемые лимиты на auth endpoints |
| **CSRF Protection** | Встроенная защита SvelteKit от CSRF |
| **Token Refresh** | Автообновление за 5 минут до истечения |
| **Session Expiration** | Автоматическая очистка истекших сессий |

## 📝 Usage Examples

### Protected Page

```typescript
// src/routes/dashboard/+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    redirect(303, "/auth/login");
  }

  return {
    user: locals.user,
  };
};
```

### Protected API Endpoint

```typescript
// src/routes/api/posts/+server.ts
import { json, error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) {
    error(401, "Unauthorized");
  }

  const posts = await db.getPosts(locals.user.sub);
  return json(posts);
};
```

### User Data in Components

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

{#if data.user}
  <h1>Welcome, {data.user.name}!</h1>
  <a href="/auth/logout">Logout</a>
{:else}
  <a href="/auth/login">Login</a>
{/if}
```

## ⚙️ Configuration Options

### Rate Limiting

Configure in `src/lib/server/auth/rate-limiter.ts`:

```typescript
const limiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 requests per window
  keyGenerator: (request) => {
    // Generate unique key per IP
    return request.headers.get("x-forwarded-for") || "unknown";
  },
});
```

### Session TTL

Configure session expiration time:

```typescript
// Redis
const sessionStore = new RedisSessionStore(redis, {
  prefix: "session:",
  defaultTTL: 86400, // 24 hours in seconds
});

// PostgreSQL
const sessionStore = new PostgresSessionStore(pool, {
  tableName: "sessions",
  cleanupIntervalMs: 3600000, // Cleanup every hour
});
```

## 📝 Commands

### Development

```bash
pnpm dev              # Запустить dev сервер
pnpm check            # TypeScript проверка
pnpm check:watch      # TypeScript проверка в watch режиме
pnpm lint             # Проверка ESLint
pnpm format           # Форматирование Prettier
```

### Build & Deploy

```bash
pnpm build            # Production сборка
pnpm preview          # Превью production сборки
```

### Utilities

```bash
pnpm copyright:add    # Добавить copyright headers в файлы
```

## 🚀 Deployment

### Environment Variables

Создайте `.env` файл в корне проекта или настройте переменные окружения в production:

```env
# OIDC Configuration
OIDC_ISSUER=https://your-oidc-provider.com
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
OIDC_REDIRECT_URI=http://localhost:5173/auth/callback

# Session Storage (выберите один)
REDIS_URL=redis://localhost:6379
# или
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Optional
SESSION_SECRET=your-random-secret-key
```

### Required Variables

| Переменная | Описание | Обязательная |
|------------|----------|--------------|
| `OIDC_ISSUER` | URL OIDC провайдера | ✅ |
| `OIDC_CLIENT_ID` | Client ID от OIDC провайдера | ✅ |
| `OIDC_CLIENT_SECRET` | Client Secret от OIDC провайдера | ✅ |
| `OIDC_REDIRECT_URI` | Redirect URI для callback | ✅ |
| `REDIS_URL` | URL Redis (для Redis store) | ⚠️ Для production |
| `DATABASE_URL` | URL PostgreSQL (для Postgres store) | ⚠️ Для production |
| `SESSION_SECRET` | Секрет для сессий | ❌ Опционально |

### Build

```bash
pnpm build
```

The build output will be in the `.svelte-kit` directory. Configure your deployment platform to serve this directory.

### Popular Platforms

- **Vercel**: Zero-config deployment
- **Netlify**: Works out of the box
- **Cloudflare Pages**: Supported with adapter-cloudflare
- **Docker**: Use Node.js adapter and create Dockerfile

## 📚 Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [OAuth 2.0 PKCE RFC](https://datatracker.ietf.org/doc/html/rfc7636)
- [OIDC Specification](https://openid.net/specs/openid-connect-core-1_0.html)

## 🤝 Contributing

1. Форкните репозиторий
2. Создайте ветку для фичи (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'Add amazing feature'`)
4. Запушьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 Legal & License

### ⚠️ Важное уведомление / Important Notice

**RU**: Данное ПО разработано **Артёмом Прянишниковым** в инициативном порядке. НЕ является служебным произведением (ст. 1295 ГК РФ). Права принадлежат автору.

**EN**: This software was developed **independently by Artyom Pryanishnikov**. NOT a work-for-hire. All rights reserved.

<div align="center">

[![License](https://img.shields.io/badge/License-PolyForm%20Shield-red.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Artyom%20Pryanishnikov-purple.svg)](https://github.com/FrankFMY)

| Разрешено / Allowed | Запрещено / Restricted |
|---------------------|------------------------|
| ✅ Личное использование | ❌ Коммерция без договора |
| ✅ Изучение кода | ❌ SaaS / Перепродажа |
| ✅ Внутренние тесты | ❌ Удаление авторства |
| ✅ Форки для обучения | ❌ Конкурирующие продукты |

**Commercial Contact**: [Pryanishnikovartem@gmail.com](mailto:Pryanishnikovartem@gmail.com)

</div>

### PolyForm Shield 1.0.0

This project is licensed under **PolyForm Shield License 1.0.0** with proprietary clauses protecting the author's intellectual property rights.

#### Initiative Development Notice

This software is an **INITIATIVE DEVELOPMENT** by Artyom Pryanishnikov.

- Created independently, **WITHOUT** Technical Assignment (TZ) or direct order
- Ownership and IP rights are **NOT** transferred automatically with employment
- Rights remain with the Author until a separate Assignment Agreement is signed
- Legal basis: Article 1295 of the Civil Code of the Russian Federation

#### Commercial Use

Any commercial use by entities other than the Copyright Holder requires a separate license agreement.

**Contact for licensing**: Pryanishnikovartem@gmail.com

#### Governing Law

Disputes shall be resolved in the **Arbitrazh Court of Saratov Region** (Арбитражный суд Саратовской области), Saratov, Russia.

---

## 👤 Author

<div align="center">

**Artyom Pryanishnikov** (Артём Прянишников)

[![GitHub](https://img.shields.io/badge/GitHub-FrankFMY-181717.svg?logo=github)](https://github.com/FrankFMY)
[![Email](https://img.shields.io/badge/Email-Pryanishnikovartem%40gmail.com-EA4335.svg?logo=gmail)](mailto:Pryanishnikovartem@gmail.com)

</div>

---

## 📧 Contact

- **GitHub**: [@FrankFMY](https://github.com/FrankFMY)
- **Email**: Pryanishnikovartem@gmail.com

## 🙏 Acknowledgments

- Inspired by the BFF (Backend-for-Frontend) security pattern
- Built with [SvelteKit](https://kit.svelte.dev/) and [Svelte 5](https://svelte.dev/)

---

<div align="center">

⭐ **Если проект был полезен, поставьте звезду!** ⭐

</div>
