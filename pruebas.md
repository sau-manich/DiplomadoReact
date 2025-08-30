## playwright

1. instalar
    ```bash
      npm init playwright@latest
    ```

2. Ejemplo antes sin test runnes se debe crear un launch, context y un page
    ```tsx
    import { chromium } from 'playwright';

    (async () => {
      const browser = await chromium.launch({ headless: false });
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('http://localhost:5173');
      await page.fill('#email', 'admin@test.com');
      await page.fill('#password', '123456');
      await page.click('text=Ingresar');

      await browser.close();
    })();
    ```
  Ahora no es necesario todo eso

3. Comandos útiles
   1. Correr uno especifico y que podamos ver

    ```bash
    npx playwright test registration.spec.ts --headed
    ```
    2. Correr una app para ver

    ```bash
    npx playwright test --ui
    ```
    3. Correr para que grabe lo que hago
    ```bash
    npx playwright codegen http://localhost:5173
    ```