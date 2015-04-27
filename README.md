# [Cypress](https://miramiku.github.io/Cypress/)
wizardry online equipment retrieval system

## Description
Wizardry Online の装備を検索または抽出を行います。

利用の想定して
* （既知の）装備データを知りたいとき → ワード検索
* （未知の）装備データを探すとき → 抽出

ことの発端としては
* 装備に無頓着な PRI が他職の装備について知りたい
* 状態異常に対応した装備（装飾品）について知りたい
* 有用な付与効果の追加装備の知り、組み合わせたい

といった願望から制作したものです。

## Concept
* シンプル
* 使いやすい
* 簡単なことは手短でき、きめ細かな操作もできる
* おしゃれ（重要）

## Features
* 装備名検索（正規表現）
* 装備の抽出（組合せ可能）
	* グレード
	* レベル
	* 品質
	* 職業
	* 装備種別
	* フラグ8種
		* 装備時付与効果
		* 状態異常付与
		* 祝福されている
		* 呪われている
		* 使用後トレード不可
		* 売却不可
		* トレード不可
		* 略奪されない
* 装備の鍛錬シミュレート
* 装備データのコピー

## Structure
* [folder] features
	* cypress.core.js - Cypress で中核となるオブジェクトを定義
	* cypress.retrieval.js - Cypress において HTML と UI の操作に関するオブジェクトを定義
	* cypress.retrieva.min.js - 公開用 JavaScript 圧縮ファイル（ cypress.core や jQuery 本体およびプラグインを包含している）
	* WizardryOnlineEquipmentJSONBuilder.java - Excel ファイルから JSON を生成するプログラムソース
	* ZeroClipboard.swf - jquery.zeroclipboard で必要なファイル (Adobe Flash)
	* そのほか jQuery および　jQuery Plugin 詳細は [Requirement](#Requirement) 参照
* [folder] images
	* [folder] law-images - Adobe Fireworks 形式の PING ファイル
	* cypress-logo.png - Cypress ロゴ
	* 使い方で使われている画像
		* usage.png - 装備カードを利用して左上に表示されているリボン
		* list-item.png - リストの項目
		* mail.png - みくのメールアドレス
		* twitter-icon.png - みくのツイッターアイコン
		* github-icon.png - リポジトリが GitHub を利用していることを示す
	* 装備カードの左上に表示されているリボン
		* poor.png
		* normal.png
		* good.png
		* master.png
		* legend.png
		* artifact.png
	* フラグアイコン
		* blessed.png - 祝福されている
		* cursed.png - 呪われている
		* used.png - 使用後トレード不可
		* stolen.png - 略奪されない
	* その他
		* copy-icon.png - 装備データのコピーボタン
	* jQuery プラグイン用
		* colorbox-overlay.png - Colorbox
		* icheck-skin.png - iCheck
		* slider-sking.png - rangeSlider
* [folder] styles
	* Lato-Regular.ttf - フッターと検索件数に使用（欧文のみのところ）
	* normalize.less - normalize.css
	* cypress-core.less - サイトの骨格とヘッダー・フッターなど共通部分のスタイル
	* cypress-retrieval.less - index.html 用のスタイル
		* cypress-retrieval.css - 公開用圧縮スタイルファイル。必要なすべてのスタイルを包含している
	* jQuery プラグイン用
		* range-slider.less - rangeSlider
		* slidebars.less - Slidebars
* index.html - Cypress 本体ページ

## Requirement
* [jQuery](https://jquery.com/)

| jQuery plugin                                                                | 利用箇所                |
| :--------------------------------------------------------------------------- | :--------------------- |
| [Slidebars](http://plugins.adchsm.me/slidebars/)                             | 検索条件パネル           |
| [rangeSlider](http://ionden.com/a/plugins/ion.rangeSlider/)                  | グレード・レベルの範囲指定 |
| [iCheck](http://fronteed.com/iCheck/)                                        | チェック・ラジオボックス   |
| [Colorbox](http://www.jacklmoore.com/colorbox/)                              | ダイアログウィンドウ      |
| [jquery.zerclipboard](https://github.com/zeroclipboard/jquery.zeroclipboard) | 装備データのコピー        |

## Licenses

* Colorbox: MIT license, http://www.jacklmoore.com/colorbox/
* iCheck: MIT license, http://fronteed.com/iCheck/
* jQuery: MIT license, https://jquery.org/license/
* jquery.zerclipboard: MIT license, https://github.com/zeroclipboard/jquery.zeroclipboard
* rangeSlider: MIT license, http://ionden.com/a/plugins/ion.rangeSlider/
* Slidebars: MIT license, http://plugins.adchsm.me/slidebars/

## Changelog
[Cyprss wiki Major Changes](https://github.com/miramiku/Cypress/wiki/Major-Changes)

## Author
[みく](https://github.com/miramiku)
