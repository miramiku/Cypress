/** Cypress の中核コード。 */

/** Package のつもり */
var CYPRESS = {};

/** CYPRESS で利用する定数 */
CYPRESS.CONSTS = {
	/** 現状キャップ */
	CAPS: {
		GRADE: 24,
		LEVEL: 80
	},
	/** 職業マスク */
	CLASSMASKS: {
		FIG:   1,
		THI:   2,
		MAG:   4,
		PRI:   8,
		SAM:  16,
		NIN:  32,
		BIS:  64,
		LOR: 128,
		CLO: 256,
		ALC: 512
	},
	ALL_RECORDS: 0 /** 全装備レコード数 */
};

/** 装備レコード（配列）の添え字とコラム名の対応 */
CYPRESS.COLUMN = {
	TYPE:           0,
	NAME:           1,
	RARITY:         2,
	GRADE:          3,
	PHYSICAL:       4,
	MAGICAL:        5,
	RANGE:          6,
	QUALITY:        7,
	CHARGE_WEIGHT:  8,
	DURABILITY:     9,
	HARDNESS:      10,
	WEIGHT:        11,
	SLASH:         12,
	STRIKE:        13,
	PIERCE:        14,
	ENCHANT:       15,
	CLASS:         16,
	HP:            17,
	MP:            18,
	STR:           19,
	VIT:           20,
	DEX:           21,
	AGI:           22,
	INT:           23,
	PIE:           24,
	LUK:           25,
	POISON:        26,
	PARALYZE:      27,
	PETRIFY:       28,
	FAINT:         29,
	BLIND:         30,
	SLEEP:         31,
	SILENCE:       32,
	CHARM:         33,
	CONFUSION:     34,
	FEAR:          35,
	FIRE_RESIST:   36,
	WATER_RESIST:  37,
	WIND_RESIST:   38,
	EARTH_RESIST:  39,
	LIGHT_RESIST:  40,
	DARK_RESIST:   41,
	FIRE_ATTACK:   42,
	WATER_ATTACK:  43,
	WIND_ATTACK:   44,
	EARTH_ATTACK:  45,
	LIGHT_ATTACK:  46,
	DARK_ATTACK:   47,
	SELL:          48,
	TRADE:         49,
	BIND:          50,
	STOLEN:        51,
	BLESSED:       52,
	CURSED:        53,
	LEVEL_FLOOR:   54,
	LEVEL_CEIL:    55,
	RESTRICTION:   56,
	WHEN_EQUIPPED: 57,
	WEPN:          58,
	STATUS_CHANGE: 59,
	PERCENT:       60,
	COMMENTS:      61,
	SOURCES:       62,
	NOTES:         63,
	CHECKUP:       64,
	EVIDENCE:      65
};

/** 装備データベース */
CYPRESS.EQUIPMENT = ( function () {
	"use strict";

	var DB_URL = "https://dl.dropboxusercontent.com/u/6164477/cypress/equipments.json",
		RARITIES = {
			1: "Poor",
			2: "Normal",
			3: "Good",
			4: "Master",
			5: "Epic",
			6: "Legend",
			7: "Artifact",
			8: "Other"
		},
		TYPES = {
			 1: "暗器",
			 2: "短剣",
			 3: "片手剣",
			 4: "両手剣",
			 5: "刀",
			 6: "片手斧",
			 7: "両手斧",
			 8: "槍",
			 9: "片手鈍器",
			10: "両手鈍器",
			11: "両手杖",
			12: "弓",
			13: "矢",
			14: "銃",
			15: "銃弾",
			16: "双刃",
			21: "兜",
			22: "帽子",
			23: "頭巾",
			26: "鎧",
			27: "上衣",
			28: "外衣",
			31: "脚鎧",
			32: "下衣",
			36: "手甲",
			37: "手袋",
			38: "腕輪",
			41: "鉄靴",
			42: "革靴",
			43: "靴",
			46: "小型盾",
			47: "中型盾",
			48: "大型盾",
			51: "外套",
			56: "指輪",
			57: "耳飾り",
			58: "首飾り",
			59: "ベルト"
		},
		_equipment = {};

	$.ajax( {
		type: "GET",
		url: DB_URL,
		dataType: "json",
		async: false,
		success: function( data ) {
			var RARITY = CYPRESS.COLUMN.RARITY,
				TYPE = CYPRESS.COLUMN.TYPE,
				records = 0;

			_equipment = data.equipments;

			$.each( _equipment, function () {
				this[ RARITY ] = RARITIES[ this[ RARITY ] ];
				this[ TYPE ] = TYPES[ this[ TYPE ] ];

				records += 1;
			} );

			CYPRESS.CONSTS.ALL_RECORDS = records;
		}
	} );

	return _equipment;
} () );

/**
 * 装備検索関数。
 * @param request 検索条件
 * @return 装備データオブジェクトの配列
 */
CYPRESS.search = function ( request ) {
	"use strict";

	var catalogs = [];

	$.each( CYPRESS.EQUIPMENT, function ( catalog, record ) {
		if ( request( this ) ) {
			catalogs.push( {
				catalog: catalog,
				forge: 0,
				equipment: [].concat( record )
			} );
		}
	} );

	return catalogs;
};
