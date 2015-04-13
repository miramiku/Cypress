/*jshint browser:true, jquery:true */

/** Cypress の中核コード。 */

/** Package のつもり */
var CYPRESS = {};

/** CYPRESS で利用する定数 */
CYPRESS.CONSTS = {
	/** 現状キャップ */
	CAP: {
		GRADE: 20,
		LEVEL: 70
	},
	/** 職業マスク */
	CLASSMASK: {
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
	STOLEN:        49,
	BLESSED:       50,
	CURSED:        51,
	USED:          52,
	LEVEL_FLOOR:   53,
	LEVEL_CEIL:    54,
	RESTRICTION:   55,
	WHEN_EQUIPPED: 56,
	WEPN:          57,
	STATUS_CHANGE: 58,
	PERCENT:       59,
	SCPN:          60,
	COMMENTS:      61,
	SOURCES:       62,
	NOTES:         63,
	CHECKUP:       64,
	EVIDENCE:      65
};

/** 装備データベース */
CYPRESS.EQUIPMENT = ( function () {
	"use strict";

	var DB_URL = "https://dl.dropboxusercontent.com/u/6164477/wizon/equipment.json",
		_equipment = {};

	$.ajax( {
		type: "GET",
		url: DB_URL,
		dataType: "json",
		async: false,
		success: function( data ) {
			var records = 0;

			_equipment = data.equipment;

			$.each( _equipment, function () {
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
 * @return 整理番号（配列）
 */
CYPRESS.search = ( function () {
	"use strict";

	var _search = function ( request ) {
			var catalogs = [];

			$.each( CYPRESS.EQUIPMENT, function ( catalog, record ) {
				if ( request( this ) ) {
					catalogs.push( catalog );
				}
			} );

			return catalogs;
		};

	return _search;
} () );
