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

Проверка, что в тестах нет `waitForTimeout` (антипаттерн — ожидание вслепую):

```bash
npm run check:no-wait-timeout
```

## Что внутри `tests/`

| Файл                                  | Что проверяет 
|---------------------------------------|
| `saucedemo-login.spec.ts`             | Успешный логин `standard_user` — попадание на страницу инвентаря 
| `saucedemo-login-negative.spec.ts`    | Два негативных сценария логина: неверный пароль и `locked_out_user`, текст ошибки 
| `saucedemo-inventory.spec.ts`         | Заголовок «Products» виден после логина 
| `saucedemo-product-link.spec.ts`      | Переход по ссылке товара (`getByRole('link')`), проверка целевой страницы 
| `saucedemo-product-filter.spec.ts`    | Поиск карточки товара через `filter({ hasText })`, добавление в корзину, проверка бейджа  корзины и смены кнопки на «Remove» 
| `saucedemo-assertions.spec.ts`        | Покрытие `toHaveValue` (значение поля логина) и `toHaveCount` (число карточек в инвентаре) |

Во всех тестах локаторы — только `getBy*` (роль, текст, placeholder, test-id), без CSS/XPath-селекторов.

## Особенности конфига

`playwright.config.ts` содержит `testIdAttribute: 'data-test'` — saucedemo использует атрибут `data-test`, а не стандартный для Playwright `data-testid`. Без этой настройки `getByTestId()` ничего не находит.

## Стек

TypeScript, `@playwright/test`, Node.js.
