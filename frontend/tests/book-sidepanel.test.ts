import { test, expect } from '@playwright/test';

test('le panneau de pages reste visible après ouverture du panneau d’éléments', async ({
  page,
}) => {
  // 1. Navigue vers l’application
  await page.goto('http://localhost:5173/book/138/pages/1');

  // 2. Vérifie que le panneau de pages est visible au départ
  const pagesPanel = page.locator('[data-testid="pages-panel"]');
  await expect(pagesPanel).toBeVisible();

  // 3. Clique sur le bouton "Éléments" pour ouvrir le panneau d’éléments
  const firstTab = page.locator('[data-testid="side-panel-tab-0"]');
  await firstTab.click();

  // 4. Vérifie que le panneau de pages reste visible
  await expect(pagesPanel).toBeVisible();

  // 5. (Optionnel) Prend une capture d’écran pour validation visuelle
  await expect(page).toHaveScreenshot('book-sidepanel-open.png', {
    fullPage: true,
  });
});
