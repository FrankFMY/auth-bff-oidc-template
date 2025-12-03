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

// src/routes/+layout.server.ts
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user
      ? {
          userId: locals.user.userId,
          isAuthenticated: true,
        }
      : null,
  };
};
