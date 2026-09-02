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

| Файл | Что проверяет
|---------------------------------------|
| `saucedemo-login.spec.ts` | Успешный логин `standard_user` — попадание на страницу инвентаря
| `saucedemo-login-negative.spec.ts` | Два негативных сценария логина: неверный пароль и `locked_out_user`, текст ошибки
| `saucedemo-inventory.spec.ts` | Заголовок «Products» виден после логина
| `saucedemo-product-link.spec.ts` | Переход по ссылке товара (`getByRole('link')`), проверка целевой страницы
| `saucedemo-product-filter.spec.ts` | Поиск карточки товара через `filter({ hasText })`, добавление в корзину, проверка бейджа корзины и смены кнопки на «Remove»
| `saucedemo-assertions.spec.ts` | Покрытие `toHaveValue` (значение поля логина) и `toHaveCount` (число карточек в инвентаре) |
| `saucedemo-cart.spec.ts` | Добавление двух товаров в корзину, удаление товара (бейдж пропадает), сортировка Z→A меняет первый товар в списке |

Во всех тестах локаторы — только `getBy*`/`byTestId` (роль, текст, placeholder, test-id), без CSS/XPath-селекторов по классам.

## Особенности конфига

saucedemo использует атрибут `data-test`, а не стандартный для Playwright `data-testid`. `playwright.config.ts` содержит `use.testIdAttribute: 'data-test'` по документации Playwright — но на практике `page.getByTestId()` всё равно не находит элементы (проверено: `page.locator('[data-test="..."]')` находит то же самое, `getByTestId()` с тем же значением — нет). Причина не выяснена.

Обходной путь — `tests/utils/by-test-id.ts`, функция `byTestId(page, id)`, использовать вместо `page.getByTestId()` везде в этом репозитории.

## Стек

TypeScript, `@playwright/test`, Node.js.
