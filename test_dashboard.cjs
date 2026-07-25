const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.stack));
    
    console.log("Setting localStorage...");
    await page.goto('http://localhost:6767'); 
    await page.evaluate(() => {
      localStorage.setItem('untoque_session', JSON.stringify({
        id: 'admin-001',
        name: 'Administrador',
        email: 'admin@untoque.com',
        role: 'superadmin'
      }));
    });
    
    console.log("Navigating to dashboard...");
    await page.goto('http://localhost:6767/dashboard');
    await new Promise(r => setTimeout(r, 3000));
    
    console.log("Done checking.");
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error("SCRIPT ERROR:", err);
    process.exit(1);
  }
})();
