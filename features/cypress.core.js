/** Cypress の中核コード。 */

/** Package のつもり */
var CYPRESS = {};

/** CYPRESS で利用する定数 */
CYPRESS.CONSTS = {
	/** 現状キャップ */
	CAPS: {
		GRADE: 20,
		LEVEL: 70
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
	WEIGHT:        10,
	HARDNESS:      11,
	SLASH:         12,
	STRIKE:        13,
	PIERCE:        14,
	CLASS:         15,
	HP:            16,
	MP:            17,
	STR:           18,
	VIT:           19,
	DEX:           20,
	AGI:           21,
	INT:           22,
	PIE:           23,
	LUK:           24,
	POISON:        25,
	PARALYZE:      26,
	PETRIFY:       27,
	FAINT:         28,
	BLIND:         29,
	SLEEP:         30,
	SILENCE:       31,
	CHARM:         32,
	CONFUSION:     33,
	FEAR:          34,
	FIRE_RESIST:   35,
	WATER_RESIST:  36,
	WIND_RESIST:   37,
	EARTH_RESIST:  38,
	LIGHT_RESIST:  39,
	DARK_RESIST:   40,
	FIRE_ATTACK:   41,
	WATER_ATTACK:  42,
	WIND_ATTACK:   43,
	EARTH_ATTACK:  44,
	LIGHT_ATTACK:  45,
	DARK_ATTACK:   46,
	SELL:          47,
	TRADE:         48,
	USED:          49,
	STOLEN:        50,
	BLESSED:       51,
	CURSED:        52,
	LEVEL_FLOOR:   53,
	LEVEL_CEIL:    54,
	RESTRICTION:   55,
	WHEN_EQUIPPED: 56,
	WEPN:          57,
	STATUS_CHANGE: 58,
	PERCENT:       59,
	COMMENTS:      60,
	SOURCES:       61,
	NOTES:         62,
	CHECKUP:       63,
	EVIDENCE:      64
};

/** 装備データベース */
CYPRESS.EQUIPMENT = ( function () {
	"use strict";

	var DB_URL = "https://dl.dropboxusercontent.com/u/6164477/wizon/equipment.json",
		RARITIES = {
			1: "Poor",
			2: "Normal",
			3: "Good",
			4: "Master",
			5: "Legend",
			6: "Artifact"
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
			32: "衣服",
			33: "下衣",
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

			_equipment = data.equipment;

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
