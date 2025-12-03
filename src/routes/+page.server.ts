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

// src/routes/+page.server.ts
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals, url }) => {
  return {
    user: locals.user
      ? {
          userId: locals.user.userId,
          isAuthenticated: true,
        }
      : null,
    error: url.searchParams.get("error"),
  };
};
