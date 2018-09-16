const headless = require('./headless');

module.exports = class {
    static async shot () {
        process.stdin.setEncoding('utf8');

        // 標準入出力！
        console.log(gakuseki);
        console.log(password);

        const browser = await headless.launch()
            .catch(err => {
                console.log('ブラウザの起動に失敗しました');
                process.exit();
            });

        const loginPage = await headless.load(browser)
            .catch(err => {
                console.log('接続に失敗しました');
                process.exit();
            });

        const UTASPage = await headless.login(gakuseki, password, loginPage)
            .catch(err => {
                console.log('ログインに失敗しました');
                process.exit();
            });

        await headless.search('実践的機械学習', UTASPage);
    }
}