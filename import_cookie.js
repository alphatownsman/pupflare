const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs');

puppeteer.use(StealthPlugin());

(async () => {
    // Export from https://chrome.google.com/webstore/detail/nmckokihipjgplolmcmjakknndddifde
    if (!process.env.PUPPETEER_COOKIEJSON || !process.env.PUPPETEER_USERDATADIR) {
        console.log("requires PUPPETEER_COOKIEJSON and PUPPETEER_USERDATADIR in env var");
        process.exit(1);
    }

    let options = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    };
    if (process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD)
        options.executablePath = '/usr/bin/chromium-browser';
    if (process.env.PUPPETEER_HEADFUL)
        options.headless = false;
    if (process.env.PUPPETEER_USERDATADIR)
        options.userDataDir = process.env.PUPPETEER_USERDATADIR;
    if (process.env.PUPPETEER_PROXY)
        options.args.push(`--proxy-server=${process.env.PUPPETEER_PROXY}`);
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    const cookies = JSON.parse(fs.readFileSync(process.env.PUPPETEER_COOKIEJSON, 'utf-8'));
    for (const cookie of cookies) {
      await page.setCookie(cookie);
    }
if (process.env.PUPPETEER_INITPAGE) {
    console.log("Checking page title " + process.env.PUPPETEER_INITPAGE);
    response = await page.goto(process.env.PUPPETEER_INITPAGE, { timeout: 30000, waitUntil: 'domcontentloaded' });
    responseBody = await response.text();
    m = responseBody.match(/<title>(.+)<\/title>/)
    console.log(m ? m[1] : 'title not found')
}
    process.exit();
})();
