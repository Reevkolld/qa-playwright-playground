import { Page, Locator } from '@playwright/test';

/**
 * Обходной путь вместо page.getByTestId().
 *
 * saucedemo использует атрибут data-test, конфиг (playwright.config.ts →
 * use.testIdAttribute) должен был перенастроить getByTestId() на него,
 * но на практике getByTestId() всё равно ищет дефолтный data-testid и не
 * находит элементы (проверено: page.locator('[data-test="..."]') находит,
 * getByTestId() — нет, при идентичном value). Причина не выяснена — не
 * стали блокировать написание тестов на нерешённой конфигурационной
 * загадке, чиним локатором напрямую.
 */
export function byTestId(page: Page, id: string): Locator {
  return page.locator(`[data-test="${id}"]`);
}
