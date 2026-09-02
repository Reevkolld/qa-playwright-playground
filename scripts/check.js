#!/usr/bin/env node
/**
 * Проверка пунктов чек-листа обучения.
 *
 *   npm run check:b12        один пункт
 *   npm run check            все пункты, по которым есть данные
 *   node scripts/check.js d1 --run    вдобавок прогнать tsc и тесты
 *
 * Проверка РЕКОМЕНДАТЕЛЬНАЯ: она видит компиляцию, наличие файлов и антипаттерны.
 * Имена тестов, границы Page Object, дублирование и уместность локатора она не видит —
 * это на эталоне в карточке пункта и на тебе. Галочку в чек-листе ставишь ты, а не скрипт.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

// ─── помощники ────────────────────────────────────────────────────────────────

function walk(dir, ext, acc = []) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return acc;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.git', 'test-results', 'playwright-report'].includes(entry.name)) continue;
      walk(rel, ext, acc);
    } else if (!ext || entry.name.endsWith(ext)) {
      acc.push(rel);
    }
  }
  return acc;
}

const exists = (p) => fs.existsSync(path.join(ROOT, p));
const read = (p) => (exists(p) ? fs.readFileSync(path.join(ROOT, p), 'utf8') : '');
const readAll = (files) => files.map(read).join('\n');

const testFiles = () => walk('tests', '.ts').filter((f) => f.endsWith('.spec.ts'));
const specText = () => readAll(testFiles());
const readme = () => read('README.md');
const stripComments = (t) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
const configRaw = () => read('playwright.config.ts');
const config = () => stripComments(configRaw());
const pkg = () => {
  try { return JSON.parse(read('package.json')); } catch { return {}; }
};
const workflows = () => walk('.github/workflows', '.yml').concat(walk('.github/workflows', '.yaml'));

function countTests(text) {
  const m = text.match(/^[ \t]*test(\.only|\.fixme|\.skip)?\s*\(/gm);
  return m ? m.length : 0;
}

function hosts(text) {
  const m = text.match(/https?:\/\/[a-z0-9.-]+/gi) || [];
  return [...new Set(m.map((u) => u.toLowerCase()))];
}

function git(cmd) {
  try { return execSync(`git --no-optional-locks ${cmd}`, { cwd: ROOT, encoding: 'utf8' }); } catch { return ''; }
}

function tryRun(cmd) {
  try {
    execSync(cmd, { cwd: ROOT, stdio: 'pipe', encoding: 'utf8' });
    return { ok: true, out: '' };
  } catch (e) {
    return { ok: false, out: String(e.stdout || '') + String(e.stderr || '') };
  }
}

// правило: [ok, «что проверено», подсказка при провале]
const rule = (ok, label, hint = '') => ({ ok, label, hint });

// ─── проверки по пунктам ──────────────────────────────────────────────────────

const CHECKS = {
  b12: () => {
    const text = specText();
    const n = countTests(text);
    const h = hosts(text);
    return [
      rule(n >= 20, `тестов: ${n} (нужно 20+)`, 'добавь ещё файл с тестами'),
      rule(h.length >= 2, `разных сайтов: ${h.length} — ${h.join(', ')}`, 'нужен второй сайт'),
      rule(!/waitForTimeout/.test(text), 'нет waitForTimeout'),
      rule(!/expect\s*\(\s*await/.test(text), 'нет ассертов вида expect(await ...)', 'это не web-first ассерт, см. C4'),
      rule(!/page\.locator\(['"`]\./.test(text), 'нет CSS-локаторов по классам'),
    ];
  },

  c1: () => {
    const files = walk('docs', '.md').filter((f) => /trace/i.test(path.basename(f)));
    const text = readAll(files);
    return [
      rule(files.length > 0, `разбор trace: ${files.length} файл(ов)`, 'создай docs/trace-<тест>.md'),
      rule(/Симптом|Symptom/i.test(text), 'есть раздел «Симптом»'),
      rule(/Причина|Root cause/i.test(text), 'есть раздел «Причина»'),
      rule(/Фикс|Fix/i.test(text), 'есть раздел «Фикс»'),
      rule(/Урок|Lesson/i.test(text), 'есть раздел «Урок»'),
    ];
  },

  c2: () => {
    const notes = read('docs/debug-notes.md');
    return [
      rule(notes.length > 0, 'есть docs/debug-notes.md'),
      rule(/--debug|Inspector/i.test(notes), 'упомянут --debug / Inspector'),
      rule(/--ui|UI Mode/i.test(notes), 'упомянут --ui / UI Mode'),
      rule(!/page\.pause\(/.test(specText()), 'нет забытых page.pause() в тестах', 'в CI это подвесит прогон'),
    ];
  },

  c3: () => {
    const c = config();
    return [
      rule(/baseURL\s*:/.test(c), 'в конфиге есть baseURL'),
      rule(/expect\s*:\s*\{/.test(c), 'задан expect.timeout'),
      rule(/actionTimeout|navigationTimeout/.test(c), 'задан action- или navigationTimeout'),
      rule(/retries\s*:\s*process\.env\.CI/.test(c), 'retries зависит от CI'),
      rule(!/Read environment variables|Mobile Chrome|branded browsers/i.test(configRaw()), 'убран закомментированный шаблон'),
      rule(/[Кк]онфигурац|[Cc]onfiguration/.test(readme()), 'в README есть раздел про конфигурацию'),
    ];
  },

  c4: () => {
    const files = walk('docs', '.md').filter((f) => /flaky/i.test(path.basename(f)));
    const text = readAll(files);
    return [
      rule(files.length > 0, `flaky-разборов: ${files.length}`, 'создай docs/flaky-<тест>.md'),
      rule(/Гипотез|Hypoth/i.test(text), 'есть раздел «Гипотезы»'),
      rule(/Причина|Root cause/i.test(text), 'есть раздел «Причина»'),
      rule(/\d+\s*(из|of|\/)\s*\d+/.test(text), 'есть числовая оценка частоты падений', 'без цифр нестабильность не доказана'),
      rule(!/expect\s*\(\s*await/.test(specText()), 'нет ассертов вида expect(await ...)'),
    ];
  },

  d1: () => {
    const pages = walk('pages', '.ts');
    const text = readAll(pages);
    return [
      rule(pages.length >= 1, `файлов в pages/: ${pages.length}`),
      rule(/export\s+class\s+\w+/.test(text), 'есть экспортируемый класс страницы'),
      rule(/Locator/.test(text), 'используются типы Locator'),
      rule(new RegExp('(LoginPage|loginPage)').test(specText()), 'тесты используют Page Object'),
    ];
  },

  d2: () => {
    const pages = walk('pages', '.ts');
    const text = readAll(pages);
    return [
      rule(exists('pages/base.page.ts'), 'есть pages/base.page.ts'),
      rule(/abstract\s+class/.test(text), 'базовый класс объявлен abstract'),
      rule(pages.filter((f) => f.endsWith('.page.ts')).length >= 3, `страниц: ${pages.filter((f) => f.endsWith('.page.ts')).length} (нужно 3+)`),
      rule((text.match(/extends\s+BasePage/g) || []).length >= 2, 'минимум две страницы наследуют базовый класс'),
    ];
  },

  d3: () => {
    const fx = read('fixtures.ts') || read('src/fixtures.ts');
    const usage = testFiles().filter((f) => /from\s+['"].*fixtures['"]/.test(read(f)));
    return [
      rule(fx.length > 0, 'есть fixtures.ts'),
      rule(/base\.extend/.test(fx), 'используется base.extend'),
      rule(/await\s+use\(/.test(fx), 'фикстуры отдают значение через await use()'),
      rule(usage.length >= 3, `файлов на фикстурах: ${usage.length} (нужно 3+)`),
    ];
  },

  d4: () => {
    const setup = readAll(walk('tests', '.ts').filter((f) => /\.setup\.ts$/.test(f)));
    const tracked = git('ls-files playwright/.auth').trim();
    return [
      rule(setup.length > 0, 'есть *.setup.ts'),
      rule(/storageState\s*\(/.test(setup), 'setup сохраняет storageState'),
      rule(/dependencies\s*:\s*\[/.test(config()), 'в конфиге есть dependencies'),
      rule(/playwright\/\.auth/.test(read('.gitignore')), 'playwright/.auth в .gitignore'),
      rule(tracked === '', 'файлы состояния не в git', 'git rm -r --cached playwright/.auth'),
    ];
  },

  d5: () => {
    const data = read('data.ts') || readAll(walk('data', '.ts'));
    const text = specText();
    const leaks = ['standard_user', 'secret_sauce', 'locked_out_user', 'Sauce Labs'].filter((s) => text.includes(s));
    return [
      rule(data.length > 0, 'есть data.ts'),
      rule(/export\s+(const|function)/.test(data), 'данные экспортируются'),
      rule(/export\s+function/.test(data), 'есть фабрика данных'),
      rule(leaks.length === 0, leaks.length ? `литералы в тестах: ${leaks.join(', ')}` : 'магических строк в тестах нет'),
    ];
  },

  d6: () => {
    const text = specText();
    const viaPom = testFiles().filter((f) => /from\s+['"].*(fixtures|pages)/.test(read(f)));
    const n = countTests(readAll(viaPom));
    return [
      rule(n >= 10, `тестов на POM: ${n} (нужно 10+)`),
      rule(!/page\.getByPlaceholder\(\s*['"]Username/.test(text), 'в тестах нет прямых локаторов формы логина'),
      rule(/[Аа]рхитектур|[Aa]rchitecture/.test(readme()), 'в README есть раздел «Архитектура»'),
      rule(exists('pages') && (exists('fixtures.ts') || exists('src/fixtures.ts')), 'структура pages/ + fixtures.ts на месте'),
    ];
  },

  e1: () => {
    const api = testFiles().filter((f) => /\{\s*request\s*\}|\brequest\b/.test(read(f)) && /request\.(get|post|put|delete)/.test(read(f)));
    const text = readAll(api);
    return [
      rule(api.length > 0, `API-файлов: ${api.length}`, 'создай tests/api-*.spec.ts'),
      rule(countTests(text) >= 3, `API-тестов: ${countTests(text)} (нужно 3+)`),
      rule(/\.status\(\)/.test(text), 'проверяется статус-код'),
      rule(/\.json\(\)/.test(text), 'проверяется тело ответа'),
      rule(!/\bpage\b/.test(text), 'API-тесты не поднимают браузер'),
    ];
  },

  e2: () => {
    const fx = read('api-fixtures.ts') || read('src/api-fixtures.ts');
    const apiTests = readAll(testFiles().filter((f) => /request\.(get|post)/.test(read(f))));
    return [
      rule(fx.length > 0, 'есть api-fixtures.ts'),
      rule(/newContext\(/.test(fx), 'создаётся свой APIRequestContext'),
      rule(/dispose\(\)/.test(fx), 'контекст закрывается через dispose()'),
      rule(!/https?:\/\//.test(apiTests), 'в API-тестах нет полных URL', 'вынеси хост в baseURL контекста'),
      rule(/API-тест|API tests/i.test(readme()), 'в README есть раздел про выбор'),
    ];
  },

  e3: () => {
    const withRoute = testFiles().filter((f) => /page\.route\(/.test(read(f)));
    const text = readAll(withRoute);
    const routeBeforeGoto = withRoute.every((f) => {
      const t = read(f);
      return t.indexOf('page.route(') < t.indexOf('page.goto(') || t.indexOf('page.goto(') === -1;
    });
    return [
      rule(withRoute.length > 0, `файлов с моками: ${withRoute.length}`),
      rule(/route\.fulfill|fulfill\(/.test(text), 'используется fulfill'),
      rule(/route\.continue|continue\(/.test(text), 'используется continue'),
      rule(routeBeforeGoto, 'route ставится до goto'),
    ];
  },

  e4: () => {
    const fx = readAll(walk('tests', '.ts')).concat(read('fixtures.ts'), read('api-fixtures.ts'));
    return [
      rule(/base\.extend/.test(fx) && /request|Api\b/.test(fx), 'есть фикстура подготовки данных через API'),
      rule(/await\s+use\([\s\S]{0,400}?\n[\s\S]{0,400}?(remove|delete)/i.test(fx), 'есть уборка после use()', 'удаляй созданную сущность после теста'),
      rule(/Date\.now\(\)|randomUUID|workerIndex/.test(fx), 'данные уникальны'),
      rule(/[Пп]одготовка данных|[Dd]ata setup/.test(readme()), 'в README есть раздел про подготовку данных'),
    ];
  },

  f1: () => {
    const wf = readAll(workflows());
    return [
      rule(workflows().length > 0, `воркфлоу: ${workflows().length}`, 'создай .github/workflows/tests.yml'),
      rule(/npm ci/.test(wf), 'используется npm ci'),
      rule(/playwright install/.test(wf), 'ставятся браузеры'),
      rule(/upload-artifact/.test(wf) && /cancelled\(\)|always\(\)/.test(wf), 'отчёт грузится и при падении'),
      rule(/badge\.svg/.test(readme()), 'бейдж в README'),
    ];
  },

  f2: () => {
    const gi = read('.gitignore');
    const src = readAll(walk('tests', '.ts').concat(walk('pages', '.ts')));
    return [
      rule(git('ls-files package-lock.json').trim() !== '', 'package-lock.json в репозитории'),
      rule(/node_modules/.test(gi) && /test-results/.test(gi) && /playwright-report/.test(gi), 'артефакты в .gitignore'),
      rule(git('ls-files test-results playwright-report node_modules').trim() === '', 'артефакты не в индексе git'),
      rule(!/[A-Z]:\\\\|[A-Z]:\//.test(src), 'нет абсолютных путей в исходниках'),
      rule(/[Кк]ак запустить|## Run|npm ci/.test(readme()), 'в README есть инструкция запуска'),
    ];
  },

  f3: () => {
    const wf = readAll(workflows());
    return [
      rule(/deploy-pages|gh-pages/.test(wf), 'есть публикация отчёта'),
      rule(/permissions/.test(wf), 'заданы permissions'),
      rule(/github\.io|pages/i.test(readme()), 'ссылка на отчёт в README'),
    ];
  },

  f4: () => {
    const p = pkg();
    const deps = Object.keys({ ...(p.devDependencies || {}), ...(p.dependencies || {}) });
    return [
      rule(deps.includes('allure-playwright'), 'allure-playwright установлен'),
      rule(/allure-playwright/.test(config()), 'allure подключён в reporter'),
      rule(/allure-results/.test(read('.gitignore')), 'allure-results в .gitignore'),
      rule(/allure/i.test(readAll(workflows())), 'есть воркфлоу с Allure'),
    ];
  },

  f5: () => {
    const df = read('Dockerfile');
    const p = pkg();
    const pw = (p.devDependencies || {})['@playwright/test'] || '';
    const version = pw.replace(/[^0-9.]/g, '');
    return [
      rule(df.length > 0, 'есть Dockerfile'),
      rule(/mcr\.microsoft\.com\/playwright/.test(df), 'используется официальный образ'),
      rule(!version || df.includes(version), `тег образа совпадает с версией Playwright (${version})`, 'иначе Playwright ругается на версию браузеров'),
      rule(/node_modules/.test(read('.dockerignore')), 'node_modules в .dockerignore'),
      rule(Object.keys(p.scripts || {}).some((s) => s.startsWith('docker')), 'есть npm-скрипты docker:*'),
    ];
  },

  f6: () => {
    const wf = readAll(workflows());
    return [
      rule(/--shard=/.test(wf), 'используется шардирование'),
      rule(/fail-fast:\s*false/.test(wf), 'fail-fast: false'),
      rule(/merge-reports/.test(wf), 'отчёты шардов сливаются'),
      rule(/fullyParallel:\s*true/.test(config()), 'fullyParallel включён'),
    ];
  },

  // ─── портфолио: те же проверки, но запускать в репозитории qa-portfolio-* ───

  g1: () => [
    rule(exists('playwright.config.ts'), 'конфиг на месте'),
    rule(/baseURL/.test(config()), 'задан baseURL'),
    rule(countTests(specText()) >= 1, 'есть хотя бы один тест'),
    rule(/[Пп]очему|## About|Why/.test(readme()), 'в README объяснён выбор сайта'),
  ],

  g2: () => {
    const text = specText();
    return [
      rule(countTests(text) >= 3, `тестов: ${countTests(text)} (нужно 3+)`),
      rule(/from\s+['"].*(fixtures|pages)/.test(text), 'тесты используют Page Object или фикстуры'),
      rule(!/\/\/html|xpath=|\/\/\*\[/.test(text), 'нет XPath'),
      rule(exists('docs'), 'есть папка docs/'),
    ];
  },

  g3: () => {
    const text = specText();
    const n = countTests(text);
    const smoke = (text.match(/@smoke/g) || []).length;
    const p = pkg();
    return [
      rule(n >= 40, `тестов: ${n} (нужно 40+)`),
      rule(/@smoke/.test(text) && /@regression/.test(text) && /@negative/.test(text), 'есть все три категории тегов'),
      rule(smoke > 0 && smoke <= Math.ceil(n * 0.2), `smoke: ${smoke} — не больше 20% набора`),
      rule(Object.keys(p.scripts || {}).some((s) => s.startsWith('test:')), 'есть npm-скрипты по категориям'),
    ];
  },

  g4: () => {
    const r = readme();
    return [
      rule(/[Сс]тек|## Stack/.test(r), 'есть раздел про стек'),
      rule(/npm ci|## Run|[Кк]ак запустить/.test(r), 'есть инструкция запуска'),
      rule(/[Сс]труктур|## Project structure/.test(r), 'есть структура проекта'),
      rule(/[Пп]окрыт|## Coverage/.test(r), 'есть раздел про покрытие'),
      rule(/[Рр]ешени|## Decisions/.test(r), 'есть раздел про решения'),
      rule(/[Нн]е покрыт|Not covered/.test(r), 'есть раздел «что не покрыто»'),
      rule(!/[Вв] планах|## Roadmap|TODO:/.test(r), 'нет раздела «в планах»'),
    ];
  },

  g5: () => {
    const files = walk('docs', '.md').filter((f) => /flaky/i.test(path.basename(f)));
    const text = readAll(files);
    return [
      rule(files.length >= 3, `flaky-разборов: ${files.length} (нужно 3+)`),
      rule(/Гипотез|Hypoth/i.test(text), 'есть гипотезы'),
      rule(/\d+\s*(из|of|\/)\s*\d+/.test(text), 'есть числовая оценка частоты'),
      rule(!/test\.skip\(\s*['"`]/.test(specText()), 'нет test.skip без объяснения', 'используй test.fixme и запись в docs/'),
    ];
  },

  g6: () => {
    const plan = read('docs/test-plan.md');
    const planned = [...plan.matchAll(/\|\s*(\d+)\s*\|/g)].map((m) => Number(m[1]));
    const actual = countTests(specText());
    const sum = planned.length ? Math.max(...planned) : 0;
    return [
      rule(plan.length > 0, 'есть docs/test-plan.md'),
      rule(/\|.*\|/.test(plan), 'есть матрица покрытия'),
      rule(/эквивалент|границ|состояни|equivalence|boundar|transition/i.test(plan), 'названы техники тест-дизайна'),
      rule(/[Нн]е автоматизир|Not automated/.test(plan), 'есть раздел «не автоматизировано»'),
      rule(sum === 0 || Math.abs(sum - actual) <= 2, `числа в плане сходятся с репозиторием (план ${sum}, факт ${actual})`),
      rule(/test-plan/.test(readme()), 'ссылка на план из README'),
    ];
  },
};

// ─── запуск ───────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const withRun = args.includes('--run');
const items = args.filter((a) => !a.startsWith('--')).map((a) => a.toLowerCase());
const targets = items.length ? items : Object.keys(CHECKS);

if (items.some((i) => !CHECKS[i])) {
  console.error(`Неизвестный пункт: ${items.filter((i) => !CHECKS[i]).join(', ')}`);
  console.error(`Доступны: ${Object.keys(CHECKS).join(', ')}`);
  process.exit(2);
}

let failed = 0;

for (const item of targets) {
  const results = CHECKS[item]();
  const ok = results.every((r) => r.ok);
  if (items.length === 0 && !results.some((r) => r.ok)) continue; // пункт ещё не начат — не шумим
  console.log(`\n${ok ? 'PASS' : 'FAIL'}  ${item.toUpperCase()}`);
  for (const r of results) {
    console.log(`  ${r.ok ? '+' : '-'} ${r.label}${!r.ok && r.hint ? `  → ${r.hint}` : ''}`);
  }
  if (!ok) failed += 1;
}

// общие проверки
const dirty = git('status --porcelain').trim();
console.log(`\n${dirty ? 'ВНИМАНИЕ' : 'OK'}  git status: ${dirty ? 'есть незакоммиченное' : 'чисто'}`);
if (dirty) {
  console.log(dirty.split('\n').map((l) => `  ${l}`).join('\n'));
  console.log('  → незакоммиченный кусок и есть долг: коммить как есть, даже сломанное');
}

if (withRun) {
  console.log('\n— tsc --noEmit');
  const tsc = tryRun('npx tsc --noEmit');
  console.log(tsc.ok ? '  PASS' : `  FAIL\n${tsc.out.split('\n').slice(0, 15).map((l) => '  ' + l).join('\n')}`);
  if (!tsc.ok) failed += 1;

  console.log('\n— npx playwright test');
  const t = tryRun('npx playwright test --reporter=line');
  console.log(t.ok ? '  PASS' : `  FAIL\n${t.out.split('\n').slice(-15).map((l) => '  ' + l).join('\n')}`);
  if (!t.ok) failed += 1;
} else {
  console.log('\nПрогон тестов и tsc не выполнялся. Нужен — добавь --run.');
}

console.log('\nПроверка рекомендательная. Что она не видит: имена тестов, границы Page Object,');
console.log('дублирование, уместность локатора. Для этого — эталон в карточке пункта.');
console.log('Галочку в чек-листе ставишь ты.\n');

process.exit(failed > 0 ? 1 : 0);
