'use strict';

const promptly = require('promptly');

module.exports = class {

  /**
   * 学籍番号、パスワードの入力
   */
  static async keyController() {
    const gakuseki = await promptly.prompt('学籍番号: ');
    const password = await promptly.prompt('パスワード: ', {
      silent: true
    })
    const keyArray = {
      'gakuseki': gakuseki,
      'password': password
    };
    return keyArray;
  }

  /**
   * 検索キーワードの入力
   */
  static async searchWordController() {
    const answer = await promptly.prompt('検索: ');
    return answer;
  }

  /**
   * スクショを撮影する科目の番号の入力
   * @param {Int} lnum 検索候補数
   */
  static async searchNumController(lnum) {
    return new Promise(async (resolve, reject) => {
      let num = await promptly.prompt('番号: ');
      num = parseInt(num, 10);
      if (num < 1 || num > lnum || isNaN(num)) {
        console.log('数値が不正です');
        this.searchNumController(lnum).then((num) => resolve(num));
      } else {
        resolve(num);
      }
    });
  }

  /**
   * スクショ撮影科目の選択時に、別タブへの遷移
   * @param {Browser} browser 
   */
  static async makeResultPage(browser) {
    return new Promise((resolve, reject) => {
      browser.once('targetcreated', () => {
        setTimeout(async () => {
          const pages = await browser.pages();
          resolve(pages[2]);
        }, 2000);
      });
    });
  }

  /**
   * スクショ撮影を続行するかの入力
   */
  static async shotHandler() {
    return new Promise(async (resolve, reject) => {
      const answer = await promptly.prompt('スクショ撮影を続けますか？ [Y/n] ');
      if (answer == 'Y' || answer == 'y' || answer == 'Yes' || answer == 'yes') {
        resolve('shot');
      } else if (answer == 'N' || answer == 'n' || answer == 'No' || answer == 'no') {
        this.searchHandler().then((res) => resolve(res));
      } else {
        this.shotHandler().then((res) => resolve(res));
      }
    });
  }

  /**
   * 検索を続行するかの入力
   */
  static async searchHandler() {
    return new Promise(async (resolve, reject) => {
      const answer = await promptly.prompt('検索を続けますか？ [Y/n] ');
      if (answer == 'Y' || answer == 'y' || answer == 'Yes' || answer == 'yes') {
        resolve('search');
      } else if (answer == 'N' || answer == 'n' || answer == 'No' || answer == 'no') {
        process.exit();
      } else {
        this.searchHandler().then((res) => resolve(res));
      }
    });
  }
}