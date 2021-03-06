[![npm version](https://badge.fury.io/js/shot-utas.svg)](https://badge.fury.io/js/shot-utas) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# ShotUTAS

コマンドライン上で UTAS(UTokyo Academic affairs System) にログインし、フリーキーワード検索を行い、シラバスのスクリーンショットを撮影できるツール。

## Installation

```
$ npm install shot-utas -g
```

**Headless Chrome を使用しており、環境によっては正常に作動しない可能性あり（[Troubleshooting](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md)）**

## Usage

```
$ shot-utas
```

学籍番号とパスワードの入力が求められるので順に入力する（ただし入力したパスワードはコマンドライン上に表示されない）。

```
学籍番号: 0000000000
パスワード:
```

`ログインに成功しました` と表示された後、検索キーワードの入力が求められるので入力する。

```
検索: 形式言語
[1] Ｓ１　月3　情報科学科　専門科目　計算機言語論　小林　直樹
[2] Ｓ１　水4, 水5　システム創成学科　学科専門科目　プログラミング応用IＣ　稗方　和夫
[3] S1S2　月2　修士課程　総合文化研究科科目　言語情報解析演習I　中澤　恒子
[4] S1S2　月2　博士後期課程　総合文化研究科科目　言語情報解析演習I　中澤　恒子
[5] S1S2　木2　情報科学科　専門科目　言語処理系論　小林　直樹
[6] A1A2　月2　情報科学科　専門科目　言語モデル論　小林　直樹
[7] A1A2　月4　総合情報学　学科科目　情報数理科学Ⅳ　森畑　明昌
[8] A1A2　月4　広域システム　学科科目　広域システム特論V（２）　森畑　明昌
[9] A1A2　金4　情報科学科　第２学年専門科目　形式言語理論　蓮尾　一郎
[10] A1A2　金5　総合情報学　学科科目　情報数理科学I[総合情報学コース]　山口　和紀
[11] A1A2　金5　広域システム　学科科目　情報数理科学I[広域システムコース]　山口　和紀
番号: 
```

例えば `形式言語` と入力すると上記のように出力される。シラバスを撮影したい科目の番号を入力する。

```
番号: 1
計算機言語論_pic1.png を出力しました
計算機言語論_pic2.png を出力しました
スクショ撮影を続けますか？ [Y/n] 
```

例えば `1` と入力すると `計算機言語論_pic1.png` と `計算機言語論_pic2.png` が出力される。

**計算機言語論_pic1.png**

<img src="https://user-images.githubusercontent.com/36184621/45759207-64472080-bc62-11e8-8df2-6c0b75f6b348.png" alt="計算機言語論_pic1.png">

**計算機言語論_pic2.png**

<img src="https://user-images.githubusercontent.com/36184621/45759233-70cb7900-bc62-11e8-9235-d73d5beb4b27.png" alt="計算機言語論_pic2.png">

`スクショ撮影を続けますか？ [Y/n] ` に `y` で答えると番号の入力に戻る。  
`n` で答えると `検索を続けますか？ [Y/n] ` と表示される。  
`y` で答えると検索キーワードの入力に戻り、`n` で答えると終了する。