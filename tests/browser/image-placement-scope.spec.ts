import { test, expect } from '@playwright/test';
import fs from 'node:fs';
const evidence = 'work/qa/image-placement-revert';
test.beforeAll(() => fs.mkdirSync(evidence, { recursive: true }));

test('Service Areas keeps its original map hero and photos appear only after opening a state', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const response = await page.goto('/service-areas/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('.location-hero-copy [data-location-gallery]')).toHaveCount(0);
    await expect(page.locator('.location-hero-copy img')).toHaveCount(0);
    await expect(page.locator('main [data-location-gallery]')).toHaveCount(0);
    await expect(page.locator('main [data-verified-photo-pending]')).toHaveCount(0);
    await expect(page.locator('#service-area-map')).toBeVisible();
    await expect(page.locator('template[data-state-gallery-template]')).toHaveCount(50);
    await page.screenshot({ path: evidence + '/map-hero-' + width + '.png' });
    await page.locator('[data-state-picker]').selectOption('California');
    const dialog = page.locator('#state-services-dialog');
    await expect(dialog).toBeVisible();
    const gallery = dialog.locator('[data-service-carousel]').first();
    await expect(gallery).toBeVisible();
    await expect(gallery).toHaveAttribute('data-carousel-index', '0');
    await gallery.locator('[data-active=true] [data-carousel-zoom]').click();
    const box = page.locator('dialog.service-image-lightbox');
    await expect(box).toBeVisible();
    await expect(box.locator('[data-lightbox-image]')).toHaveCSS('object-fit', 'contain');
    await page.keyboard.press('Escape');
    await dialog.locator('[data-close-state]').click();
    await expect(dialog.locator('img')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});

test('directory and generic category layouts have no unsolicited photo sections', async ({ page }) => {
  for (const route of [
    '/service-areas/alabama/central-alabama/cities/',
    '/equipment-rental/mobile-kitchen-trailers/',
    '/portable-dishwashing-trailer-rental/',
    '/equipment-rental/shower-trailer/',
    '/equipment-rental/mobile-sleep-trailers/',
    '/equipment-rental/laundry-trailers/',
    '/services/shower-restroom-combination-trailers/',
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('main .approved-equipment-photo-option')).toHaveCount(0);
    await expect(page.locator('main [data-location-gallery]')).toHaveCount(0);
    await expect(page.locator('main h1')).toHaveCount(1);
    if (route.endsWith('/cities/')) await expect(page.locator('#city-directory-search')).toBeVisible();
  }
});
