//@prepros-prepend jquery.min.js
//@prepros-prepend slidebars.min.js
//@prepros-prepend icheck.min.js
//@prepros-prepend cypress.core.js

CYPRESS.INDEX = {
	"武器":      1,
	"防具":      2,
	"装飾品":    3,
	"片手剣":    4,
	"両手剣":    5,
	"片手斧":    6,
	"両手斧":    7,
	"片手鈍器":  8,
	"両手鈍器":  9,
	"槍":       10,
	"暗器":     11,
	"短剣":     12,
	"両手杖":   13,
	"刀":       14,
	"双刃":     15,
	"弓":       16,
	"矢":       17,
	"銃":       18,
	"銃弾":     19,
	"兜":       20,
	"帽子":     21,
	"頭巾":     22,
	"鎧":       23,
	"外衣":     24,
	"上衣":     25,
	"脚鎧":     26,
	"衣服":     27,
	"下衣":     28,
	"手甲":     29,
	"手袋":     30,
	"腕輪":     31,
	"鉄靴":     32,
	"革靴":     33,
	"靴":       34,
	"大型盾":   35,
	"中型盾":   36,
	"小型盾":   37,
	"外套":     38,
	"指輪":     39,
	"耳飾り":   40,
	"首飾り":   41,
	"ベルト":   42,

	"Poor":     1,
	"Normal":   2,
	"Good":     3,
	"Master":   4,
	"Legend":   5,
	"Artifact": 6
};

CYPRESS.CONSTS.RARITIES = [ "Poor", "Normal", "Good", "Master", "Legend", "Artifact" ];
CYPRESS.CONSTS.WEAPONS = [ "暗器", "短剣", "片手剣", "両手剣", "刀", "片手斧", "両手斧", "槍", "片手鈍器", "両手鈍器", "両手杖", "弓", "矢", "銃", "銃弾", "双刃" ];
CYPRESS.CONSTS.GUARDS = [ "兜", "帽子", "頭巾", "鎧", "上衣", "外衣", "手甲", "手袋", "腕輪", "脚鎧", "衣服", "下衣", "鉄靴", "革靴", "靴", "小型盾", "中型盾", "大型盾", "外套" ];
CYPRESS.CONSTS.ACCESSORIES = [ "指輪", "耳飾り", "首飾り", "ベルト" ];

$( document ).ready( function () { /** boot Cypress */
	"use strict";

	var COLUMN = CYPRESS.COLUMN,
		EQUIPMENT = CYPRESS.EQUIPMENT,
		INDEX = CYPRESS.INDEX,
		GRADE_CAP = CYPRESS.CONSTS.CAP.GRADE,
		TYPES_NUM = 42,
		RARITIES_NUM = 6,
		GENERAL = 0,
		mySlidebars = new $.slidebars(),
		SPREADSHEET = ( function () {
				var _array = [];

				for ( var grade = 0; grade < GRADE_CAP + 1; grade += 1 ) {
					_array[ grade ] = [];
					for ( var type = 0; type < TYPES_NUM + 1; type += 1 ) {
						_array[ grade ][ type ] = [];
						for ( var rarity = 0; rarity < RARITIES_NUM + 1; rarity += 1 ) {
							_array[ grade ][ type ][ rarity ] = 0;
						}
					}
				}

				return _array;
			} () );

	( function () { // initialize slidebars
		$( "#toolbox-button-box" ).click( function () {
			$( "#toolbox-button" ).toggleClass( "close" );
			return false;
		} );

		mySlidebars.slidebars.open( "right" );
	} () );

	( function () { // iCheck initialize
		$( "#rarity-checkboxes input" )
		.each( function () {
			var $self = $( this ),
				label = $self.data( "label" );

			$self.iCheck( {
				checkboxClass: "icheckbox " + label.toLowerCase(),
				insert: "<div class=\"icheck-icon\"></div>" + label
			} );
		} );
	} () );

	( function () { // build table
		$.each( [ CYPRESS.CONSTS.WEAPONS, CYPRESS.CONSTS.GUARDS, CYPRESS.CONSTS.ACCESSORIES ], function () {
			$.each( this, function () {
				var row = "";
				row += "<tr data-category=\"" + this + "\"><th>" + this + "</th><td></td>";
				row += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>";
				row += "</tr>";
				
				$( "#counting tbody" ).append( row );
			} );
		} );
	} () );

	( function () { // counting
		$.each( EQUIPMENT, function ( caralog, record ) {
			SPREADSHEET[ record[ COLUMN.GRADE ] ][ GENERAL ][ GENERAL ] += 1;

			SPREADSHEET[ record[ COLUMN.GRADE ] ][ GENERAL ][ INDEX[ record[ COLUMN.RARITY ] ] ] += 1;
			SPREADSHEET[ record[ COLUMN.GRADE ] ][ INDEX[ record[ COLUMN.TYPE ] ] ][ INDEX[ record[ COLUMN.RARITY ] ] ] += 1;
			SPREADSHEET[ record[ COLUMN.GRADE ] ][ INDEX[ record[ COLUMN.TYPE ] ] ][ GENERAL ] += 1;

			SPREADSHEET[ GENERAL ][ GENERAL ][ INDEX[ record[ COLUMN.RARITY ] ] ] += 1;
			SPREADSHEET[ GENERAL ][ INDEX[ record[ COLUMN.TYPE ] ] ][ GENERAL ] += 1;
		} );
	} () );

	( function () { // display
		for ( var grade = 1; grade < GRADE_CAP + 1; grade += 1 ) {
			$.each( [ CYPRESS.CONSTS.WEAPONS, CYPRESS.CONSTS.GUARDS, CYPRESS.CONSTS.ACCESSORIES ], function () {
				$.each( this, function () {
					$( "#counting [data-category=\"" + this + "\"] td:nth-child(" + ( grade + 2 ) + ")").html( SPREADSHEET[ grade ][ INDEX[ this ] ][ GENERAL ]  );
				} );
			} );
		}
	} () );

	console.log( SPREADSHEET[ 0 ][ 0 ] );
} );
