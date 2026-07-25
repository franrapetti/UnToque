const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.stack));
  
  await page.goto('http://localhost:6767'); // go to root to set localStorage
  await page.evaluate(() => {
    localStorage.setItem('untoque_session', JSON.stringify({
      id: 'admin-001',
      name: 'Administrador',
      email: 'admin@untoque.com',
      role: 'superadmin'
    }));
  });
  
  await page.goto('http://localhost:6767/dashboard');
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
