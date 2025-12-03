#!/usr/bin/env node
/**
 * Скрипт для добавления copyright headers в файлы проекта
 * Запуск: pnpm run copyright:add или node scripts/add-copyright.ts
 */

import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

const COPYRIGHT_TS = `/**
 * @fileoverview Auth BFF OIDC Template — Initiative Development / Инициативная разработка
 * @author Artyom Pryanishnikov <Pryanishnikovartem@gmail.com>
 * @copyright 2025 Artyom Pryanishnikov
 * @license PolyForm-Shield-1.0.0
 * 
 * INITIATIVE DEVELOPMENT: Created independently, without TZ or direct order.
 * IP rights remain with the Author. Commercial use requires agreement.
 * Contact: Pryanishnikovartem@gmail.com
 */

`;

const COPYRIGHT_SVELTE = `<!--
  Auth BFF OIDC Template — Initiative Development / Инициативная разработка
  @author Artyom Pryanishnikov <Pryanishnikovartem@gmail.com>
  @copyright 2025 Artyom Pryanishnikov | @license PolyForm-Shield-1.0.0
  
  Created independently, without TZ. IP rights remain with Author.
  Commercial use requires agreement. Contact: Pryanishnikovartem@gmail.com
-->

`;

const EXTENSIONS: Record<string, string> = {
  '.ts': COPYRIGHT_TS,
  '.tsx': COPYRIGHT_TS,
  '.js': COPYRIGHT_TS,
  '.svelte': COPYRIGHT_SVELTE,
};

const IGNORE_DIRS = [
  'node_modules',
  '.svelte-kit',
  'dist',
  'build',
  '.git',
  '.turbo',
  '.vercel',
  '.netlify',
  '.output',
];

const IGNORE_FILES = [
  '*.d.ts',
  '*.config.*',
  'vite-env.d.ts',
  'app.d.ts',
];

async function* walk(dir: string): AsyncGenerator<string> {
  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const path = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!IGNORE_DIRS.includes(entry.name)) {
          yield* walk(path);
        }
      } else {
        yield path;
      }
    }
  } catch (error) {
    // Ignore errors (e.g., permission denied)
    console.warn(`Warning: Cannot read directory ${dir}: ${error}`);
  }
}

function shouldIgnore(filename: string): boolean {
  return IGNORE_FILES.some((pattern) => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(filename);
  });
}

async function addCopyright(filePath: string): Promise<boolean> {
  const ext = extname(filePath);
  const header = EXTENSIONS[ext];

  if (!header) return false;
  if (shouldIgnore(filePath)) return false;

  try {
    const content = await readFile(filePath, 'utf-8');

    // Уже есть copyright
    if (
      content.includes('@copyright') ||
      content.includes('Copyright') ||
      content.includes('Initiative Development')
    ) {
      return false;
    }

    // Для Svelte: вставляем в начало файла
    if (ext === '.svelte') {
      const newContent = COPYRIGHT_SVELTE + content;
      await writeFile(filePath, newContent, 'utf-8');
      return true;
    }

    // Для TS/JS: вставляем в начало
    const newContent = header + content;
    await writeFile(filePath, newContent, 'utf-8');
    return true;
  } catch (error) {
    console.warn(`Warning: Cannot process ${filePath}: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🔒 Adding copyright headers...\n');

  let added = 0;
  let skipped = 0;

  // Обрабатываем src/ директорию
  for await (const file of walk('src')) {
    if (await addCopyright(file)) {
      console.log(`✅ ${file}`);
      added++;
    } else {
      skipped++;
    }
  }

  // Обрабатываем корневые файлы (если нужно)
  // Можно добавить обработку других директорий при необходимости

  console.log(`\n📊 Done: ${added} files updated, ${skipped} skipped`);
}

main().catch(console.error);

