'use strict';

const fs = require('fs');
const child_process = require('child_process');

module.exports = class {

    /**
     * インターフェイスを作成
     */
    static makeReadline () {
        process.stdin.setEncoding('utf8');
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return readline;
    }

    /**
     * 学籍番号、パスワードの入力
     */
    static async keyController () {
        return new Promise((resolve, reject) => {
            const readline = this.makeReadline();
            const keyArray = {}
    
            readline.question('学籍番号: ', (answer) => {
                keyArray['gakuseki'] = answer;
                readline.question('パスワード: ', (answer) => {
                    keyArray['password'] = answer;
                    readline.close();
                    resolve(keyArray);
                });
            });
        });
    }

    /**
     * 検索キーワードの入力
     */
    static async searchWordController () {
        const readline = this.makeReadline();
        return new Promise((resolve, reject) => {
            readline.question('検索: ', (answer) => {
                readline.close();
                resolve(answer);
            });
        });
    }

    /**
     * スクショを撮影する科目の番号の入力
     * @param {Int} lnum 検索候補数
     */
    static async searchNumController (lnum) {
        const readline = this.makeReadline();
        return new Promise ((resolve, reject) => {
            readline.question('番号: ', (num) => {
                readline.close();
                num = parseInt(num, 10);
                if (num < 1 || num > lnum || isNaN(num)) {
                    console.log('数値が不正です')
                    return this.searchNumController(lnum).then((num) => resolve(num));
                } else {
                    resolve (num);
                }
            });
        });
    }

    /**
     * スクショ撮影科目の選択時に、別タブへの遷移
     * @param {Browser} browser 
     */
    static async makeResultPage (browser) {
        return new Promise ((resolve, reject) => {
            browser.once('targetcreated', () => {
                setTimeout(async () => {
                    const pages = await browser.pages();
                    return resolve(pages[2]);
                }, 2000);
            });
        });
    }

    /**
     * mkdir -p のPromiseラッパー
     * @param {String} filename 
     */
    static async mkdir (filename) {
        return new Promise((resolve, reject) => {
            child_process.exec(`mkdir -p ${filename}`, (err, stdout, stderr) => {
                err ? reject(err) : resolve();
            })
        });
    }

    /**
     * スクショ撮影を続行するかの入力
     */
    static async shotHandler () {
        const readline = this.makeReadline();
        return new Promise ((resolve, reject) => {
            readline.question('スクショ撮影を続けますか？ [Y/n] ', (answer) => {
                readline.close();
                if (answer == 'Y' || answer == 'y' || answer == 'Yes' || answer == 'yes') {
                    resolve('shot');
                } else if (answer == 'N' || answer == 'n' || answer == 'No' || answer == 'no') {
                    this.searchHandler().then((res) => resolve(res));
                } else {
                    return this.shotHandler().then((res) => resolve(res));
                }
            });
        });
    }

    /**
     * 検索を続行するかの入力
     */
    static async searchHandler () {
        const readline = this.makeReadline();
        return new Promise ((resolve, reject) => {
            readline.question('検索を続けますか？ [Y/n] ', async (answer) => {
                readline.close();
                if (answer == 'Y' || answer == 'y' || answer == 'Yes' || answer == 'yes') {
                    resolve('search');
                } else if (answer == 'N' || answer == 'n' || answer == 'No' || answer == 'no') {
                    process.exit();
                } else {
                    return this.searchHandler().then((res) => resolve(res));
                }
            });        
        });
    }
}

