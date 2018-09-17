const puppeteer = require('puppeteer');
const utilities = require('./utilities');

module.exports = class {

    static async launch () {
        return puppeteer.launch({ headless: true });
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

    static async login (keyArray, page) {
        await page.type('#userNameInput', keyArray['gakuseki']);
        await page.type('#passwordInput', keyArray['password']);
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

    static async search (keyword, browser, page) {
        await page.type('#freeKeyword', keyword);
        page.click('input[type=button]');
        await page.waitForNavigation({timeout: 30000, waitUntil: 'networkidle0'}).catch(err => {
            console.log('検索に失敗しました');
        });

        await page.$('.error').then(async (err) => {
            if (err) {
                console.log("検索結果の候補がありませんでした");
                utilities.searchController();
            } else {
                const rows = await page.$$('tr');
                rows.shift();
                for (const row of rows) {
                    const data = await row.$$eval('td', nodes => nodes.map(n => n.innerText.replace('\t', '')));
        
                    data.splice(11, 1); data.splice(8, 1); data.splice(4, 3);
                    console.log(`[${data[0]}] ` + data.slice(1).join('　'));
                }

                const num = await utilities.searchNumController (rows.length);
                const subject = await rows[num - 1].$$eval('td', nodes => {
                    nodes[9].innerText.replace('\t', '');
                });

                const button = await rows[num - 1].$('input');
                await button.click();

                await browser.once('targetcreated', async () => {
                    const pages = await browser.pages();
                    const resultPage = pages[2];
                    await resultPage.screenshot({path: `${subject}_basicInfo.jpeg`, fullPage: true, quality:100})
                    const pages1 = await resultPage.$('#tab-1');
                    await pages1.screenshot('hogehoge.png');                    
                });
                // resultPage.screenshot({path: `${subject}_basicInfo.png`, fullPage: true})
                /* const page2 = await page.$('a[href=tabs-2]').click();
                page2.$('#tabs-2').screenshot({path: `${subject}_detailedInfo.png`}); */
            }
        });

        console.log("fin");
    }
}
