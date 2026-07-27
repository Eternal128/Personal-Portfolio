import { chromium } from 'playwright';

const OUT = '/private/tmp/claude-501/-Users-jameswilliamhanzell-Downloads-3D-portfolio/31fea6fc-90b8-4bc9-a420-a24b4762c68e/scratchpad';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1200 } });

await page.goto('http://localhost:5174', { waitUntil: 'load' });
await page.waitForTimeout(2500);
await page.click('body');
await page.waitForTimeout(1500);

await page.locator('nav >> text=Blog').first().click();
await page.waitForTimeout(2000);
await page.screenshot({ path: `${OUT}/blog-settled.png` });

const info = await page.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('.blog-card'));
  return cards.map((card) => {
    const thumb = card.querySelector('.blog-card-thumb');
    const cardRect = card.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();
    const cs = getComputedStyle(card);
    return {
      cardTop: cardRect.top, cardHeight: cardRect.height,
      thumbTop: thumbRect.top, thumbHeight: thumbRect.height,
      gapAboveThumb: thumbRect.top - cardRect.top,
      display: cs.display, alignItems: cs.alignItems,
    };
  });
});
console.log(JSON.stringify(info, null, 2));

await browser.close();
