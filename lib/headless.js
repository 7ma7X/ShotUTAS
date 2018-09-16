const puppeteer = require('puppeteer');

module.exports = class {

    static async launch () {
        return puppeteer.launch({ headless: false });
    }

    static async load (browser) {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(10000);
        page.setViewport({width: 1200, height: 800})

        await page.goto('https://utas.adm.u-tokyo.ac.jp/campusweb/campusportal.do', {waitUntil: 'networkidle2'});
        page.click('#wf_PTW0000011_20120827233559-form');
        await page.waitForNavigation({waitUntil: 'networkidle2'});

        return page;
    }

    static async login (gakuseki, password, page) {
        await page.type('#userNameInput', gakuseki);
        await page.type('#passwordInput', password);
        page.click('#submitButton');

        await page.waitForNavigation({waitUntil: 'networkidle0'});

        await page.waitForNavigation({waitUntil: 'networkidle0'}).catch(err => {
            console.log('ログインに失敗しました 学籍番号かパスワードが誤っている可能性があります');
            process.exit();
        }).then(async() => {
            console.log('ログインに成功しました');
            await page.goto('https://utas.adm.u-tokyo.ac.jp/campusweb/campusportal.do?page=main&tabId=sy', {waitUntil: 'networkidle2'});
        });

        const url = await page.$eval('#main-frame-if', f => f.src);
        await page.goto(url, {waitUntil: 'networkidle2'});
        return page;
    }

    static async search (keyword, page) {
        await page.type('#freeKeyword', keyword);
        page.click('input[type=button]');
        await page.waitForNavigation({timeout: 30000, waitUntil: 'networkidle0'}); // 検索時間かかりすぎる場合

        await page.$('.error').then(async (err) => {
            if (err) {
                console.log("検索失敗")
            } else {
                const rows = await page.$$('tr');
                rows.shift();
                for (const row of rows) {
                    const data = await row.$$eval('td', nodes => nodes.map(n => n.innerText.replace('\t', '')));
        
                    data.splice(11, 1); data.splice(8, 1); data.splice(4, 3);
                    console.log(`[${data[0]}] ` + data.slice(1).join('　'));
                }
            }
        });

        console.log("fin");
    }
}
