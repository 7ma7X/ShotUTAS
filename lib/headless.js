'use strict';

const puppeteer = require('puppeteer');
const utilities = require('./utilities');

module.exports = class {

    /**
     * Headless Chrome を起動する
     * @return {Browser}
     */
    static async launch () {
        return puppeteer.launch();
    }

    /**
     * UTAS のページに接続する
     * @param {Browser} browser 
     * @return {Page}
     */
    static async load (browser) {
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(10000);
        page.setViewport({width: 1200, height: 800})

        await page.goto('https://utas.adm.u-tokyo.ac.jp/campusweb/campusportal.do', {waitUntil: 'networkidle0'});
        page.click('#wf_PTW0000011_20120827233559-form');
        await page.waitForNavigation({waitUntil: 'networkidle0'});

        return page;
    }

    /**
     * UTAS にログインする
     * @param {Array<String>} keyArray 学籍番号とパスワード
     * @param {Page} page 
     * @return {Page}
     */
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
            await page.goto('https://utas.adm.u-tokyo.ac.jp/campusweb/campusportal.do?page=main&tabId=sy', {waitUntil: 'networkidle0'});
        });

        const url = await page.$eval('#main-frame-if', f => f.src);
        await page.goto(url, {waitUntil: 'networkidle0'});
        return page;
    }

    /**
     * UTAS で検索を行う
     * @param {String} keyword 検索ワード
     * @param {Browser} browser 
     * @param {Page} page 
     */
    static async search (keyword, browser, page) {
        await page.type('#freeKeyword', keyword);
        page.click('input[value=" 検索 "]');
        await page.waitForNavigation({timeout: 0, waitUntil: 'networkidle0'});

        await page.$('.error').then(async (err) => {
            if (err) {
                console.log("検索結果の候補がありませんでした");
                await utilities.searchHandler();
            } else {
                const rows = await page.$$('tr');
                rows.shift();
                for (const row of rows) {
                    const data = await row.$$eval('td', nodes => nodes.map(n => n.innerText.replace('\t', '')));
        
                    data.splice(11, 1); data.splice(8, 1); data.splice(4, 3);
                    console.log(`[${data[0]}] ` + data.slice(1).join('　'));
                }

                while (true) {
                    let num = await utilities.searchNumController (rows.length);  
                    await this.takeShot(num, rows, browser);
                    let res = await utilities.shotHandler();
                    if (res == 'search') break;
                }

                await page.goBack();
            }

            page.click('input[value=" ク リ ア "]');
            await page.waitForNavigation({waitUntil: 'networkidle0'});
            const searchWord = await utilities.searchWordController();
            this.search(searchWord, browser, page);
        });
    }

    /**
     * 指定された番号の科目のスクショを撮影する
     * @param {Int} num 指定された番号
     * @param {Array<ElementHandle>} rows 科目データ
     * @param {Browser} browser 
     */
    static async takeShot (num, rows, browser) {
        const target_row = rows[num - 1];
        const data = await target_row.$$eval('td', nodes => nodes.map(n => n.innerText.replace('\t', '')));
        const subject = data[9];

        const button = await rows[num - 1].$('input');
        await button.click();

        const resultPage = await utilities.makeResultPage(browser);
        const elements = await resultPage.$$('div');
        const element = elements[2];

        await element.screenshot({path: `${subject}_pic1.png`});
        console.log(`${subject}_pic1.png を出力しました`);

        const links = await resultPage.$$('li');
        const href = await links[1].$eval('a', el => el.href);
        const resultPage2 = await browser.newPage();
        await resultPage2.goto(href, {waitUntil: 'networkidle0'});
        const elements2 = await resultPage2.$$('div');
        const element2 = await elements2[3];

        await element2.screenshot({path: `${subject}_pic2.png`});
        console.log(`${subject}_pic2.png を出力しました`); 

        resultPage.close();
        resultPage2.close();
    }
}
