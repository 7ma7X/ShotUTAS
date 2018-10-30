'use strict';

const headless = require('./headless');
const utilities = require('./utilities');

module.exports = class {

  static async shot() {
    const keyArray = await utilities.keyController();

    const browser = await headless.launch()
      .catch((err) => {
        console.log('ブラウザの起動に失敗しました');
        process.exit();
      });

    const loginPage = await headless.load(browser)
      .catch((err) => {
        console.log('接続に失敗しました');
        process.exit();
      });

    const UTASPage = await headless.login(keyArray, loginPage)
      .catch((err) => {
        console.log('接続に失敗しました');
        process.exit();
      });

    const searchWord = await utilities.searchWordController();
    headless.search(searchWord, browser, UTASPage);
  }

}