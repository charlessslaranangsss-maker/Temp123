import { chromium } from '@playwright/test'
import { writeFile } from 'node:fs/promises'

const routes = [
  '/remote-workforce-housing-services-in-alaska/',
  '/equipment-rental/shower-trailer/portable-shower-trailers-in-new-jersey-usa/',
  '/equipment-rental/restroom-trailers/portable-restroom-trailers-in-california/',
  '/man-camps-for-rent/',
]

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch({ headless: true })
const results = []

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport })

    for (const route of routes) {
      const page = await context.newPage()
      const consoleErrors = []
      const pageErrors = []

      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text())
      })
      page.on('pageerror', (error) => pageErrors.push(error.message))

      const response = await page.goto(`https://temporary123.com${route}`, {
        waitUntil: 'networkidle',
      })

      const result = await page.evaluate(() => ({
        url: window.location.href,
        h1: document.querySelector('h1')?.textContent?.trim() ?? '',
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '',
        robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '',
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      }))

      results.push({
        viewport: viewport.name,
        route,
        status: response?.status() ?? null,
        ...result,
        consoleErrors,
        pageErrors,
        passed:
          response?.status() === 200 &&
          result.url === `https://temporary123.com${route}` &&
          Boolean(result.h1) &&
          Boolean(result.title) &&
          !result.horizontalOverflow &&
          consoleErrors.length === 0 &&
          pageErrors.length === 0,
      })

      await page.close()
    }

    await context.close()
  }
} finally {
  await browser.close()
}

const summary = {
  checked: results.length,
  passed: results.filter((result) => result.passed).length,
  failed: results.filter((result) => !result.passed).length,
  results,
}

await writeFile(
  new URL('../audit/legacy-url-restoration-2026-09-18/browser-verification.json', import.meta.url),
  `${JSON.stringify(summary, null, 2)}\n`,
)

console.log(JSON.stringify(summary, null, 2))
if (summary.failed > 0) process.exitCode = 1
