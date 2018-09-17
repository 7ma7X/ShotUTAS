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

    static async searchController () {
        const readline = this.makeReadline();
        return new Promise((resolve, reject) => {
            readline.question('検索を続けますか？[Y/n] ', async (answer) => {
                readline.close();
                if (answer == 'Y' || 'y') {
                    const searchWord = await utilities.searchWordController();
                    await headless.search(searchWord, UTASPage);
                } else if (answer == 'N' || 'n') {
                    process.exit();
                } else {
                    this.searchController();
                }
            });
        });       
    }

    static async searchWordController () {
        const readline = this.makeReadline();
        return new Promise((resolve, reject) => {
            readline.question('検索: ', (answer) => {
                readline.close();
                resolve(answer);
            });
        });
    }

    static async searchNumController (lnum) {
        const readline = this.makeReadline();
        return new Promise ((resolve, reject) => {
            readline.question('番号: ', (num) => {
                readline.close();
                num = parseInt(num, 10);
                if (num < 1 || num > lnum) {
                    console.log('数値が不正です')
                    return this.searchNumController(lnum).then((num) => {
                        resolve (num);
                    });
                } else {
                    resolve (num);
                }
            });
        });
    }
}

