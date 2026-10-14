# qa-playwright-playground

Учебный репозиторий для отработки Playwright + TypeScript. Тесты пишутся на [saucedemo.com](https://www.saucedemo.com/) — открытом демо-сайте для тренировки автотестов.

## Запуск

```bash
npm install
npx playwright test
```

Другие варианты запуска:

```bash
npx playwright test --headed        # видно браузер
npx playwright test --ui            # UI-режим
npx playwright test --debug         # пошаговая отладка через Inspector
npx playwright test tests/имя-файла.spec.ts   # один файл
```

## Аутентификация

В `playwright.config.ts` настроены два проекта:

- `setup` запускает `tests/auth.setup.ts`: входит в SauceDemo как `standard_user` и сохраняет состояние браузера в `playwright/.auth/user.json`.
- `chromium` зависит от `setup` и использует сохранённый `storageState`. Поэтому сценарии каталога и корзины начинают работу в авторизованной сессии. Фикстура `loggedInInventory` только предоставляет `InventoryPage`; логин внутри неё не выполняется.
  Тестам, которые проверяют сам вход в SauceDemo, нужна чистая сессия: `saucedemo-login.spec.ts`, `saucedemo-login-negative.spec.ts` и `saucedemo-assertions.spec.ts` задают пустые `cookies` и `origins` через `test.use()`.

Файл `playwright/.auth/user.json` содержит сохранённое состояние авторизации и исключён из Git через `.gitignore`. Для запуска всех тестов используется `npx playwright test`; основной проект можно запустить отдельно флагом `--project=chromium`.

Проверка, что в тестах нет `waitForTimeout` (антипаттерн — ожидание вслепую):

```bash
npm run check:no-wait-timeout
```

## Что внутри `tests/`

| Файл | Что проверяет
|---------------------------------------|
| `saucedemo-login.spec.ts` | Успешный логин `standard_user` — попадание на страницу инвентаря
| `saucedemo-login-negative.spec.ts` | Два негативных сценария логина: неверный пароль и `locked_out_user`, текст ошибки
| `saucedemo-inventory.spec.ts` | Заголовок «Products» виден после логина
| `saucedemo-checkout.spec.ts` | Успешное продолжение checkout и валидация обязательных полей, включая комбинации пустых значений
| `saucedemo-product-link.spec.ts` | Переход по ссылке товара (`getByRole('link')`), проверка целевой страницы
| `saucedemo-product-filter.spec.ts` | Поиск карточки товара через `filter({ hasText })`, добавление в корзину, проверка бейджа корзины и смены кнопки на «Remove»
| `saucedemo-assertions.spec.ts` | Покрытие `toHaveValue` (значение поля логина) и `toHaveCount` (число карточек в инвентаре) |
| `saucedemo-cart.spec.ts` | Добавление двух товаров в корзину, удаление товара (бейдж пропадает), сортировка Z→A меняет первый товар в списке |

Для семантических элементов используются `getBy*`-локаторы, а атрибуты SauceDemo `data-test` выбираются напрямую через `page.locator('[data-test="..."]')`.

Тестовые учётные данные, названия товаров и данные checkout централизованы в `data.ts`.

## Стек

TypeScript, `@playwright/test`, Node.js.
