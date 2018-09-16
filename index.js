const utasshot = require('./lib/utasshot');

utasshot.shot();

/*
async function test () {
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.waitForResponse('https://twitter.com/hellorusk');
    await browser.close();
}

test ();*/