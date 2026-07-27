import { chromium } from 'playwright';

const OUT = '/private/tmp/claude-501/-Users-jameswilliamhanzell-Downloads-3D-portfolio/31fea6fc-90b8-4bc9-a420-a24b4762c68e/scratchpad';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1000 } });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

await page.goto('http://localhost:5174', { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.click('body');
await page.waitForTimeout(1500);

// Let everything (images/videos/fonts) settle before we start
await page.waitForTimeout(3000);

await page.locator('nav >> text=Experience').first().click();
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/repro-experience.png` });

// Scroll continuously from Experience through Tech into Projects, screenshotting each step
for (let i = 0; i <= 20; i++) {
  await page.screenshot({ path: `${OUT}/repro-scroll-${String(i).padStart(2, '0')}.png` });
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
}

console.log('ERRORS:', JSON.stringify(errors));
await browser.close();
