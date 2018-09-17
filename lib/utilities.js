module.exports = class {
    static makeReadline () {
        process.stdin.setEncoding('utf8');
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        return readline;
    }

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

    static async searchWordController (isContinued) {
        // あとで2回目以降の処理

        return new Promise((resolve, reject) => {
            const readline = this.makeReadline();
            readline.question('検索: ', (answer) => {
                readline.close();
                resolve(answer);
            });
        });
    }
}