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

// src/routes/auth/logout/+server.ts
import type { RequestHandler } from "./$types";
import { redirect } from "@sveltejs/kit";
import { authService } from "$lib/server/auth/bff.js";

export const POST: RequestHandler = async ({ cookies, locals }) => {
  const sessionId = cookies.get("session_id");

  if (sessionId && locals.user) {
    // Получаем сессию перед удалением для отзыва токена
    const session = await authService.getSession(sessionId);

    // Отзываем refresh token в IdP
    if (session?.refreshToken) {
      await authService.revokeToken(session.refreshToken);
    }

    // Удаляем сессию с сервера
    await authService.deleteSession(sessionId);
  }

  // Удаляем cookie
  cookies.delete("session_id", { path: "/" });

  throw redirect(302, "/");
};
