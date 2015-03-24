/*jshint browser:true, jquery:true */

/**
 * Cypress の中核コード。
 */
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

// @changes 入手先項目
// @changes 装備自身のコメントと備考としてのコメントを分離
/** 装備レコード（配列）の添え字とコラム名の対応 */
CYPRESS.COLUMN = {
	TYPE:           0,
	NAME:           1,
	RARITY:         2,
	GRADE:          3,
	PHYSICAL:       4,
	MAGIC:          5,
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
	NIL_RESIST:    41,
	FIRE_ATTACK:   42,
	WATER_ATTACK:  43,
	WIND_ATTACK:   44,
	EARTH_ATTACK:  45,
	LIGHT_ATTACK:  46,
	DARK_ATTACK:   47,
	NIL_ATTACK:    48,
	SELL:          49,
	TRADE:         50,
	STOLEN:        51,
	BLESSED:       52,
	CURSED:        53,
	USED:          54,
	LEVEL_FLOOR:   55,
	LEVEL_CEIL:    56,
	RESTRICTION:   57,
	WHEN_EQUIPPED: 58,
	WEPN:          59,
	STATUS_CHANGE: 60,
	PERCENT:       61,
	SCPN:          62,
	NOTES:         63,
	CHECKUP:       64,
	EVIDENCE:      65
};

/** 装備データベース */
CYPRESS.EQUIPMENT = ( function () {
	"use strict";

	var _equipment = {};

	$.ajax( {
		type: "GET",
		url: "equipment.json",
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
