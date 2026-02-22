import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  page.on('response', resp => {
    if (!resp.ok() && resp.url().includes('contentstack')) {
      console.log(`API FAILED: ${resp.status()} ${resp.url()}`);
    }
  });

  console.log('Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  console.log('Navigated to Home Page.');

  await browser.close();
})();
