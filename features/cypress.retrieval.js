/*jshint browser:true, jquery:true */
/*global CYPRESS */

/** 検索条件の受け渡し */
CYPRESS.STATUS ={
	"rarity": {
		"Poor":     false,
		"Normal":   false,
		"Good":     false,
		"Master":   false,
		"Legend":   false,
		"Artifact": false
	},
	"class": {
		"FIG": false,
		"THI": false,
		"MAG": false,
		"PRI": false,
		"SAM": false,
		"NIN": false,
		"BIS": false,
		"LOR": false,
		"CLO": false
	},
	"type": {
		"片手剣":   false,
		"両手剣":   false,
		"片手斧":   false,
		"両手斧":   false,
		"片手鈍器": false,
		"両手鈍器": false,
		"槍":       false,
		"暗器":     false,
		"短剣":     false,
		"両手杖":   false,
		"刀":       false,
		"双刃":     false,
		"弓":       false,
		"矢":       false,
		"銃":       false,
		"銃弾":     false,
		"兜":       false,
		"帽子":     false,
		"頭巾":     false,
		"鎧":       false,
		"外衣":     false,
		"上衣":     false,
		"脚鎧":     false,
		"衣服":     false,
		"下衣":     false,
		"手甲":     false,
		"手袋":     false,
		"腕輪":     false,
		"鉄靴":     false,
		"革靴":     false,
		"靴":       false,
		"大型盾":   false,
		"中型盾":   false,
		"小型盾":   false,
		"外套":     false,
		"指輪":     false,
		"耳飾り":   false,
		"首飾り":   false,
		"ベルト":   false
	},
	"flag": {
		"when_equipped": "all",
		"status_change": "all",
		"blessed":       "all",
		"cursed":        "all",
		"used":          "all",
		"sell":             "all",
		"trade":         "all",
		"stolen":        "all"
	}
};

/** 標準装備下限レベル（定数） */
CYPRESS.CONSTS.STANDARD_LEVEL_FLOOR = [
	/* Grade  1 */  1,
	/* Grade  2 */  1,
	/* Grade  3 */  1,
	/* Grade  4 */  1,
	/* Grade  5 */  1,
	/* Grade  6 */  1,
	/* Grade  7 */  1,
	/* Grade  8 */  1,
	/* Grade  9 */ 24,
	/* Grade 10 */ 27,
	/* Grade 11 */ 30,
	/* Grade 12 */ 33,
	/* Grade 13 */ 36,
	/* Grade 14 */ 38,
	/* Grade 15 */ 40,
	/* Grade 16 */ 42,
	/* Grade 17 */ 44,
	/* Grade 18 */ 46,
	/* Grade 19 */ 48,
	/* Grade 20 */ 50
];

CYPRESS.CONSTS.FORGING_DATA = {
	// ref: https://github.com/miramiku/Cypress/wiki/Wizardy-Online-Forging-Data
	QUALITY: [ 1.00, 1.05, 1.15, 1.27, 1.39, 1.54, 1.69, 1.84, 1.99, 2.14, 2.29 ],
	GP: { "小型盾":  5, "中型盾": 10, "大型盾": 15 },
	WEIGHT: [
		//              0   +1   +2   +3   +4   +5   +6   +7   +8   +9  +10
		/* < 0.2 */ [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
		/* < 0.4 */ [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1 ],
		/* < 1.0 */ [ 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2 ],
		/* < 2.0 */ [ 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2, 0.2, 0.2 ],
		/* < 4.0 */ [ 0.0, 0.0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3, 0.4 ],
		/* 4.0 < */ [ 0.0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.5, 0.5 ]
	],
	//        0  +1  +2  +3  +4  +5  +6   +7   +8   +9  +10
	LENGTH: [ 0, 10, 20, 30, 40, 60, 80, 100, 120, 120, 120 ],
	SPECIAL_QUALITY: {
		//      0 +1 +2 +3 +4 +5  +6  +7  +8  +9 +10
		"弓": [ 0, 0, 0, 1, 2, 3,  4,  5,  7,  7,  7 ],
		"銃": [ 0, 1, 2, 4, 6, 9, 12, 16, 21, 21, 21 ]
	}
};

/**
 * EquipmentCardの内容 (HTML) を取得するする。
 * @param equipment 装備レコード
 * @return EquipmentCard (HTML)
 */
CYPRESS.getEquipmentCard = ( function () {
	"use strict";

	var COLUMN = CYPRESS.COLUMN,
		CLASSMASK = CYPRESS.CONSTS.CLASSMASK,
		STANDARD_LEVEL_FLOOR = CYPRESS.CONSTS.STANDARD_LEVEL_FLOOR,

		// 種別定義（攻撃力が上がる or 防御力が上がる）
		WEAPONS = [ "暗器", "短剣", "片手剣", "両手剣", "刀", "片手斧", "両手斧", "槍", "片手鈍器", "両手鈍器", "両手杖", "弓", "矢", "銃", "銃弾", "双刃" ],
	//    GUARDS = [ "兜", "帽子", "頭巾", "鎧", "上衣", "外衣", "手甲", "手袋", "腕輪", "脚鎧", "衣服", "下衣", "鉄靴", "革靴", "靴", "小型盾", "中型盾", "大型盾", "外套", "指輪", "耳飾り", "首飾り", "ベルト" ],
		// ↑未使用

		// 表示順序定義
		CLASS_ORDER                 = [ "FIG", "THI", "MAG", "PRI", "SAM", "NIN", "BIS", "LOR", "CLO" ],
	//    CLASS_ORDER                 = [ "FIG", "THI", "MAG", "PRI", "SAM", "NIN", "BIS", "LOR", "CLO", "ALC" ],
		PHYSICAL_ATTRIBUTES_ORDER   = [ "SLASH", "STRIKE", "PIERCE" ],
		SPECIAL_EFFECTS_ORDER       = [ "hp", "mp", "str", "vit", "dex", "agi", "int", "pie", "luk" ],
		RESISTANCE_ORDER            = [ "poison", "paralyze", "petrify", "faint", "blind", "sleep", "silence", "charm", "confusion", "fear" ],
		ATTRIBUTES_ORDER            = [ "fire", "water", "wind", "earth", "light", "dark" ],

		// 条件分岐用
		WITHOUT_PHYSICAL_ATTRIBUTES = [ "弓", "銃", "指輪", "耳飾り", "首飾り", "ベルト" ], // 物理属性が存在しない
		WITH_SPECIAL_PROPERTIES     = [ "弓", "矢", "銃", "銃弾", "小型盾", "中型盾", "大型盾" ],
		SHOTS                       = [ "矢", "銃弾" ],
		ACCESSORIES                 = [ "指輪", "耳飾り", "首飾り", "ベルト" ],

		_equipmentCard = function ( catalog ) {
			var equipment = CYPRESS.EQUIPMENT[ catalog ],

				buildCard = {
					card: "<div class=\"equipment-card\" data-catalog=\"" + catalog + "\" data-forge=\"0\">",

					isTypeContains: function ( list ) {
						var type = equipment[ COLUMN.TYPE ];

						for ( var i = 0, listLength = list.length; i < listLength; i += 1 ) {
							if ( type === list[ i ] ) {
								return true;
							}
						}
						return false;
					},
					buildTransfarTagData: function ( column, content ) {
						this.card += "<span class=\"" + column + "\">" + ( equipment[ COLUMN[ column.toUpperCase() ] ] ? "" : content ) + "</span>";
					},
					buildSupplimentTagData: function ( column, text ) {
						if ( equipment[ COLUMN[ column.toUpperCase() ] ] ) {
							this.card += "<span class=\"" + column + "\"><img src=\"images/" + column + ".png\" alt=\"\">" + text + "</span>";
						}
					},

					// structure
					label: function ( label ) {
						this.card += "<span class=\"label\">" + label + "：</span>";
						return this;
					},
					sectionDivider: function () {
						this.card += "<div class=\"section-divider\"></div>";
						return this;
					},
					group: function ( groupName ) {
						this.card += "<div class=\"" + groupName + "\">";
						return this;
					},
					end: function () {
						this.card += "</div>";
						return this;
					},

					// generic
					unsignedInteger: function ( className, column ) {
						var value = equipment[ column ];

						this.card += "<span class=\"" + className + ( value === 0 ? " zero" : " positive" ) + "\">" + value + "</span>";

						return this;
					},
					signedInteger: function ( className, column ) {
						var value = equipment[ column ],
							sign = "zero",
							data = 0;

						if ( value < 0 ) {
							sign = "negative";
							data = value;
						} else if ( 0 < value ) {
							sign = "positive";
							data = "+" + value;
						}

						this.card += "<span class=\"" + className + " " + sign + "\">" + data + "</span>";

						return this;
					},
					direct: function ( className, column ) {
						this.card += "<span class=\"" + className + "\">" + equipment[ column ] + "</span>";
						return this;
					},

					// concrete: generic
					type: function () {
						this.direct( "type", COLUMN.TYPE );
						return this;
					},
					grade: function () {
						this.direct( "grade", COLUMN.GRADE );
						return this;
					},
					restriction: function () {
						this.direct( "restriction", COLUMN.RESTRICTION );
						return this;
					},
					name: function () {
						this.direct( "name", COLUMN.NAME );
						return this;
					},

					// concrete: special
					rarity: function () {
						this.card += "<span class=\"rarity\">" + equipment[ COLUMN.RARITY ] + "</span>";
						return this;
					},
					level: function () {
						var STDLVF = STANDARD_LEVEL_FLOOR[ equipment[ COLUMN.GRADE ] - 1 ],
							floor  = equipment[ COLUMN.LEVEL_FLOOR ],
							ceil   = equipment[ COLUMN.LEVEL_CEIL ],

							floorText = "Lv " + equipment[ COLUMN.LEVEL_FLOOR ],
							ceilText  = ceil === -1 ? "" : "Lv " + ceil,
							sign      = "normal";

						if ( ceil !== -1 || STDLVF < floor ) {
							sign = "negative";
						} else if ( floor < STDLVF ) {
							sign = "positive";
						}

						this.card += "<span class=\"level " + sign + "\">" + floorText + "～" + ceilText + "</span>";

						return this;
					},
					powers: function () {
						var type = this.isTypeContains( WEAPONS ) ? "weapons" : "guards";

						this.card += "<span class=\"physical " + type + "\">" + equipment[ COLUMN.PHYSICAL ] + "</span>" +
									 "<span class=\"magical " + type + "\">" + equipment[ COLUMN.MAGIC ] + "</span>";

						return this;
					},
					whenEquipped: function () {
						this.card += equipment[ COLUMN.WHEN_EQUIPPED ] === "" ?
							"<span class=\"when-equipped zero\"></span>" :
							( "<span class=\"when-equipped " + ( equipment[ COLUMN.WEPN ] ? "positive" : "negative" ) +"\">" + equipment[ COLUMN.WHEN_EQUIPPED ] + "</span>" );
						return this;
					},
					statusChange: function () {
						this.card += 0 < equipment[ COLUMN.PERCENT ] ?
							( "<span class=\"status-change " + ( equipment[ COLUMN.SCPN ] ? "positive" : "negative" ) +"\">" + equipment[ COLUMN.STATUS_CHANGE ] + " (" + equipment[ COLUMN.PERCENT ] + "%)</span>" ) :
							"<span class=\"status-change zero\"></span>";
						return this;
					},
					classRestriction: function () {
						var cr = equipment[ COLUMN.CLASS ],
							buildClassIcon = function ( cls ) {
								return "<span class=\"" + cls.toLowerCase() + " " + ( cr & CLASSMASK[ cls ] ? "equipable" : "non-equipable" ) + "\">" + cls + "</span>";
							},
							that = this;

						this.group( "class-restriction" );
						$.each( CLASS_ORDER, function () {
							that.card += buildClassIcon( this );
						} );
						this.end();

						return this;
					},

					// complex
					transfarTags: function () {
						this.buildTransfarTagData( "sell", "[売却不可]" );
						this.buildTransfarTagData( "trade", "[トレード不可]" );
						this.buildTransfarTagData( "stolen", "<img src=\"images/stolen.png\" alt=\"略奪されない\">略奪されない" );
						this.buildSupplimentTagData( "used", "使用後トレード不可" );

						return this;
					},
					supplimentTags: function () {
						this.buildSupplimentTagData( "blessed", "祝福されている" );
						this.buildSupplimentTagData( "cursed", "呪われている" );

						return this;
					},
					physicalAttributes: function () {
						var that = this;

						if ( !( this.isTypeContains( WITHOUT_PHYSICAL_ATTRIBUTES ) ) ) {
							this.group( "physical-attributes" );
							this.label( "物理属性" );
							$.each( PHYSICAL_ATTRIBUTES_ORDER, function () {
								that.card += "<span class=\"" + this.toLowerCase() + "\">" + equipment[ COLUMN[ this ] ] + "</span>";
							} );
							this.end();
						}

						return this;
					},
					properties: function () {
						if ( this.isTypeContains( ACCESSORIES ) ) {
							this.card += "<span class=\"weight\">"     + equipment[ COLUMN.WEIGHT ].toFixed( 2 ) + "</span>";
						} else if ( this.isTypeContains( SHOTS ) ) {
							this.card += "<span class=\"weight\">"     + equipment[ COLUMN.WEIGHT ].toFixed( 2 ) + "</span>" +
										 "<span class=\"hardness\">"   + equipment[ COLUMN.HARDNESS ]            + "</span>";
						} else {
							this.card += "<span class=\"durability\">" + equipment[ COLUMN.DURABILITY ]          + "</span>" +
										 "<span class=\"weight\">"     + equipment[ COLUMN.WEIGHT ].toFixed( 2 ) + "</span>" +
										 "<span class=\"hardness\">"   + equipment[ COLUMN.HARDNESS ]            + "</span>";
						}

						return this;
					},
					specialPropertiesLine: function () {
						var content = {
							"弓": function () {
								return "<span class=\"range\">"             + equipment[ COLUMN.RANGE ]         + "</span>" +
									   "<span class=\"quality bows\">"      + equipment[ COLUMN.QUALITY ]       + "</span>";
							},
							"矢": function () {
								return "<span class=\"range-rate\">"        + equipment[ COLUMN.RANGE ]         + "%</span>" +
									   "<span class=\"quality-rate bows\">" + equipment[ COLUMN.QUALITY ]       + "%</span>";
							},
							"銃": function () {
								return "<span class=\"range\">"             + equipment[ COLUMN.RANGE ]         + "</span>" +
									   "<span class=\"quality guns\">"      + equipment[ COLUMN.QUALITY ]       + "</span>" +
									   "<span class=\"charge-weight\">"     + equipment[ COLUMN.CHARGE_WEIGHT ] + "</span>";
							},
							"銃弾": function () {
								return "<span class=\"range-rate\">"        + equipment[ COLUMN.RANGE ]         + "%</span>" +
									   "<span class=\"quality-rate guns\">" + equipment[ COLUMN.QUALITY ]       + "%</span>";
							},
							"小型盾": function () {
								return "<span class=\"gp\">"                + equipment[ COLUMN.QUALITY ]       + "</span>";
							},
							"中型盾": function () {
								return "<span class=\"gp\">"                + equipment[ COLUMN.QUALITY ]       + "</span>";
							},
							"大型盾": function () {
								return "<span class=\"gp\">"                + equipment[ COLUMN.QUALITY ]       + "</span>";
							}
						};

						if ( this.isTypeContains( WITH_SPECIAL_PROPERTIES ) ) {
							this.group( "special-properties" );
							this.card += content[ equipment[ COLUMN.TYPE ] ]();
							this.end();
						}

						return this;
					},
					specialEffectsLine: function () {
						var specialEffects = ( function () {
									var obj = {};

									$.each( SPECIAL_EFFECTS_ORDER, function () {
										obj[ this ] = equipment[ COLUMN[ this.toUpperCase() ] ];
									} );

									return obj;
								} () ),
							isAllZero = ( function () {
									for ( var se in specialEffects ) {
										if ( specialEffects[ se ] !== 0 ) {
											return false;
										}
									}
									return true;
								} () ),
							that = this;

						if ( !isAllZero ) {
							this.group( "special-effects" );
							this.label( "特殊効果" );
							$.each( SPECIAL_EFFECTS_ORDER, function () {
								that.signedInteger( this, COLUMN[ this.toUpperCase() ] );
							} );
							this.end();
						}

						return this;
					},
					resistanceLine: function () {
						var resistance = ( function () {
									var obj = {};

									$.each( RESISTANCE_ORDER, function () {
										obj[ this ] = equipment[ COLUMN[ this.toUpperCase() ] ];
									} );

									return obj;
								} () ),
							isAllZero = ( function () {
									for ( var rst in resistance ) {
										if ( resistance[ rst ] !== 0 ) {
											return false;
										}
									}
									return true;
								} () ),
							that = this;

						if ( !isAllZero ) {
							this.group( "resistance" );
							this.label( "状態異常耐性" );
							$.each( RESISTANCE_ORDER, function () {
								that.unsignedInteger( this, COLUMN[ this.toUpperCase() ] );
							} );
							this.end();
						}

						return this;
					},
					magicAttributesLine: function () {
						var label = {
								attack: "魔攻属性",
								resist: "魔防属性"
							},
							that = this,
							checkAllZero= function ( type ) {
								for ( var atr in attributes[ type ] ) {
									if ( attributes[ type ][ atr ] !== 0 ) {
										isAllZero[ type ] = false;
										break;
									}
								}
							},
							attributes = ( function () {
								var setAttributes = function ( type ) {
										var obj = {};

										$.each( ATTRIBUTES_ORDER, function () {
											 obj[ this ] = equipment[ COLUMN[ this.toUpperCase() + "_" + type.toUpperCase() ] ];
										} );

										return obj;
									};

								return {
									attack: setAttributes( "attack" ),
									resist: setAttributes( "resist" )
								};
							} () ),
							isAllZero = ( function () {
								var checkAllZero= function ( type ) {
										for ( var atr in attributes[ type ] ) {
											if ( attributes[ type ][ atr ] !== 0 ) {
												return false;
											}
										}
										return true;
									};

								return {
									attack: checkAllZero( "attack" ),
									resist: checkAllZero( "resist" )
								};
							} () ),
							build = function ( type ) {
								that.group( type );
								that.label( label[ type ] );
								if ( !isAllZero[ type ] ) {
									$.each( attributes[ type ], function ( atr, val ) {
										that.signedInteger( atr, COLUMN[ atr.toUpperCase() + "_" + type.toUpperCase() ] );
									} );
								} else {
									that.card += "<span class=\"allZero\">補正なし</span>";
								}
								that.end();
							};

						if ( !isAllZero.attack || !isAllZero.resist ) {
							this.group( "magic-attributes" );
							build( "attack" );
							build( "resist" );
							this.end();
						}

						return this;
					},
					otherDataLine: function () {
						var whenEquipped = equipment[ COLUMN.WHEN_EQUIPPED ],
							percent = equipment[ COLUMN.PERCENT ];

						if ( whenEquipped !== "" || 0 < percent ) {
							this.group( "other-data" );
							this.card += equipment[ COLUMN.WHEN_EQUIPPED ] === "" ?
								"<span class=\"when-equipped zero\"></span>" :
								( "<span class=\"when-equipped " + ( equipment[ COLUMN.WEPN ] ? "positive" : "negative" ) +"\">" + equipment[ COLUMN.WHEN_EQUIPPED ] + "</span>" );
							this.card += 0 < equipment[ COLUMN.PERCENT ] ?
								( "<span class=\"status-change " + ( equipment[ COLUMN.SCPN ] ? "positive" : "negative" ) +"\">" + equipment[ COLUMN.STATUS_CHANGE ] + " (" + equipment[ COLUMN.PERCENT ] + "%)</span>" ) :
								"<span class=\"status-change zero\"></span>";
							this.end();
						}

						return this;
					},
					notesLine: function () {
						var notes = equipment[ COLUMN.NOTES ];

						if ( notes !== "" ) {
							this.group( "note-line" );
							this.sectionDivider();
							this.card += "<span class=\"notes\">" + notes + "</span>";
							this.end();
						}

						return this;
					},
					toolbox: function () {
						var ableForge = ( function () {
								var rarity = equipment[ COLUMN.RARITY ],
									type = equipment[ COLUMN.TYPE ];
								if ( rarity === "Legend" || rarity === "Artifact" ) {
									return " disabled";
								} else if ( type === "矢" || type === "銃弾" ) {
									return " disabled";
								}
								return "";
							} () );

						this.card += "<div class=\"toolbox\"><div class=\"tool-buttons\">" +
									 "<span class=\"tool-button forging-plus" + ableForge + "\">+1</span>" +
									 "<span class=\"tool-button forging-minus disabled\">-1</span>" +
									 "<span class=\"tool-button data-copy\"><img src=\"images/law-images/copy-icon-law.png\" alt=\"copy equipment data\"></span>" +
									 "</div></div>";
						return this;
					}
				};

			buildCard
				.group( "equipment-card-inner " + equipment[ COLUMN.RARITY ].toLowerCase() )
					.group( "basic-information" )
						.group( "property" )
							.rarity().type().transfarTags()
						.end() // .property
						.group( "restrictions" )
							.level().grade()
							.restriction()
						.end() // .restrictions
						.group( "name-box" )
							.name().supplimentTags()
						.end() // .name-box
					.end() // .basic-information
					.sectionDivider()
					.classRestriction()
					.group( "capabilities" )
						.powers().properties()
						.physicalAttributes()
					.end() // .capabilities
					.specialPropertiesLine()
					.specialEffectsLine()
					.resistanceLine()
					.magicAttributesLine()
					.otherDataLine()
					.notesLine()
				.end() // .equipment-card-inner
				.toolbox()
			.end();

			return buildCard.card;
		};

	return _equipmentCard;
} () );

/**
 * カタログ番号からカードを表示する。
 * @param catalogs カタログ番号（配列）
 */
CYPRESS.displayEquipmentCard = ( function () {
	var _display = function ( catalogs ) {
			$( "#equipments" ).empty();
			$( "#usage-button" ).prop( "disabled", false );

			$.each( catalogs, function () {
				$( "#equipments" ).append( CYPRESS.getEquipmentCard( this ) );
			} );
		};

	return _display;
} () );

/**
 * UIから検索条件の生成。
 * @return 検索条件（関数）
 */
CYPRESS.makeRequest = function () {
	"use strict";

	var COLUMN = CYPRESS.COLUMN,
		/** キーワード検索 */
		_matchWord = ( function () {
			var word = $( "#equipment-name" ).val();

			if ( word === "" ) {
				return function ( record ) {
					return true;
				};
			} else {
				return function ( record ) {
					return record[ COLUMN.NAME ].match( word ) !== null;
				};
			}
		} () ),
		/** グレード範囲フィルタ */
		_containsGradeRange = ( function () {
			var range = $( "#grade-range" ).prop( "value" ).split( ";" ),
				floor = parseInt( range[ 0 ] ),
				ceil = parseInt( range[ 1 ] );

			if ( floor === 1 ) {
				if ( ceil === CYPRESS.CONSTS.CAP.GRADE ) {
					return function ( record ) { // case 1: 全範囲
						return true;
					};
				} else {
					return function ( record ) { // case 2: 上限を変更
						return record[ COLUMN.GRADE ] <= ceil;
					};
				}
			} else {
				if ( ceil === CYPRESS.CONSTS.CAP.GRADE ) {
					return function ( record ) { // case 3: 下限を変更
						return floor <= record[ COLUMN.GRADE ];
					};
				} else {
					return function ( record ) { // case 4: 下限・上限とも変更
						var grade = record[ COLUMN.GRADE ];
						return floor <= grade && grade <= ceil;
					};
				}
			}
		} () ),
		/** レベル範囲フィルタ */
		_containsLevelRange = ( function () {
			var range = $( "#level-range" ).prop( "value" ).split( ";" ),
				floor = parseInt( range[ 0 ] ),
				ceil = parseInt( range[ 1 ] );

			if ( floor === 1 ) {
				if ( ceil === CYPRESS.CONSTS.CAP.LEVEL ) {
					return function ( record ) { // case 1: 全範囲
						return true;
					};
				} else {
					return function ( record ) { // case 2: 上限を変更
						return record[ COLUMN.LEVEL_FLOOR ] <= ceil;
					};
				}
			} else {
				if ( ceil === CYPRESS.CONSTS.CAP.LEVEL ) {
					return function ( record ) { // case 3: 下限を変更
						var equipmentCeil = record[ COLUMN.LEVEL_CEIL ];

						return floor <= ( equipmentCeil === -1 ? CYPRESS.CONSTS.CAP.LEVEL : equipmentCeil );
					};
				} else {
					return function ( record ) { // case 4: 下限・上限とも変更
						var equipmentCeil = record[ COLUMN.LEVEL_CEIL ];

						return floor <= ( equipmentCeil === -1 ? CYPRESS.CONSTS.CAP.LEVEL : equipmentCeil ) && record[ COLUMN.LEVEL_FLOOR ] <= ceil;
					};
				}
			}
		} () ),
		/** 職業フィルタ */
		_containsClasses = ( function () {
			var classMask = CYPRESS.CONSTS.CLASSMASK,
				requireMask = ( function () {
					var mask = 0;

					$.each( CYPRESS.STATUS[ "class" ], function ( key, value ) {
						mask += ( value ? classMask[ key ] : 0 );
					} );

					return mask;
				} () );

			// memo: 511: FIG -> CLO ( without ALC )
			if ( requireMask === 0 || requireMask === 511 ) {
				return function ( record ) {
					return true;
				};
			} else {
				return function ( record ) {
					return requireMask & record[ COLUMN.CLASS ];
				};
			}
		} () ),
		/** 包含チェック */
		_containsSelection = function ( column ) {
			var selection = 0;

			$.each( CYPRESS.STATUS[ column ], function () {
				selection += this ? 1 : 0;
			} );

			if ( !selection ) {
				return function ( record ) {
					return true;
				};
			} else {
				return function ( record ) {
					return CYPRESS.STATUS[ column ][ record[ COLUMN[ column.toUpperCase() ] ] ];
				};
			}
		},
		/** 文字列フラグフィルタ */
		_filterStringFlag = function ( flag ) {
			switch ( CYPRESS.STATUS.flag[ flag ] ) {
			case "only":
				return function ( record ) {
					return record[ COLUMN[ flag.toUpperCase() ] ] !== "";
				};
			case "eliminate":
				return function ( record ) {
					return record[ COLUMN[ flag.toUpperCase() ] ] === "";
				};
			default: // case "all"
				return function ( record ) {
					return true;
				};
			}
		},
		/** ブーリアンフラグフィルタ */
		_filterBooleanFlag = function ( flag, inv ) {
			switch ( CYPRESS.STATUS.flag[ flag ] ) {
			case "only":
				return function ( record ) {
					return inv ? !record[ COLUMN[ flag.toUpperCase() ] ] :  record[ COLUMN[ flag.toUpperCase() ] ];
				};
			case "eliminate":
				return function ( record ) {
					return inv ?  record[ COLUMN[ flag.toUpperCase() ] ] : !record[ COLUMN[ flag.toUpperCase() ] ];
				};
			default: // case "all"
				return function ( record ) {
					return true;
				};
			}
		},

		_containsRarities   = _containsSelection( "rarity" ),
		_containsTypes      = _containsSelection( "type" ),
		_filterWhenEquipped = _filterStringFlag( "when_equipped" ),
		_filterStatusChange = _filterStringFlag( "status_change" ),
		_filterBlessed      = _filterBooleanFlag( "blessed", false ),
		_filterCursed       = _filterBooleanFlag( "cursed",  false ),
		_filterUsed         = _filterBooleanFlag( "used",    false ),
		_filterSell         = _filterBooleanFlag( "sell",    true  ),
		_filterTrade        = _filterBooleanFlag( "trade",   true  ),
		_filterStolen       = _filterBooleanFlag( "stolen",  true  ),

		_request = function ( record ) {
			return _matchWord( record )          && // 文字列検索
				   _containsGradeRange( record ) && // グレード範囲
				   _containsLevelRange( record ) && // レベル範囲
				   _containsClasses( record )    && // 職業フィルタ
				   _containsRarities( record )   && // 品質フィルタ
				   _containsTypes( record )      && // 種別フィルタ
				   _filterWhenEquipped( record ) && // 「装備時に」
				   _filterStatusChange( record ) && // 「状態異常」
				   _filterBlessed( record )      && // 「祝福されている」
				   _filterCursed( record )       && // 「呪われている」
				   _filterUsed( record )         && // 「使用後取引不可」
				   _filterSell( record )         && // 「NPC売却可否」
				   _filterTrade( record )        && // 「取引可否」
				   _filterStolen( record );         // 「略奪できない」
		};

	return _request;
};

/**
 * 鍛錬をシミュレートして装備データを書き換える。
 * @param $card jQuery 該当する装備カード
 */
CYPRESS.forging = ( function () {
	return function ( $card ) {
		var COLUMN = CYPRESS.COLUMN,
			FORGING_DATA = CYPRESS.CONSTS.FORGING_DATA,
			EQUIPMENT_RECORD = CYPRESS.EQUIPMENT[ $card.data( "catalog" ) ],
			forgeValue = $card.data( "forge" ),
			forging = {
				name: function () {
				},
				quality: function () {
				},
				durability: function () {
				},
				hardness: function () {
				},
				gp: function () {
				},
				weight: function () {
				},
				length: function () {
				},
				specialQuality: function () {
				}
			},
			$name = $card.find( ".name" );

		if ( 0 < forgeValue ) {
			$name.text( EQUIPMENT_RECORD[ COLUMN.NAME ] + "+" + forgeValue );
		} else {
			$name.text( EQUIPMENT_RECORD[ COLUMN.NAME ] );
		}
	};
} () );

/** Cypress 操作ファサード（クラス） */
CYPRESS.Manager = ( function () {
	"use strict";

	var _equipments = [], // private field
		_writeRecords = function ( records ) { // private function
			$( "#records" ).html( ( function () {
				switch ( records ) {
				case 0:
					$( "#search-button-main, #search-button-sub" ).prop( "disabled", true );
					return "<span class=\"no-records\">no records</span>";
				case CYPRESS.CONSTS.ALL_RECORDS:
					$( "#search-button-main, #search-button-sub" ).prop( "disabled", false );
					return "<span class=\"all-records\">" + CYPRESS.CONSTS.ALL_RECORDS + " (all) records</span>";
				default:
					$( "#search-button-main, #search-button-sub" ).prop( "disabled", false );
					return "<span>" + records + " records</span>";
				}
			} () ) );
		},
		/**
		 * 検索結果から装備一覧を描写する
		 */
		_display = function () {
			CYPRESS.displayEquipmentCard( _equipments );
		},
		/**
		 * カードを鍛錬シミュレートしたデータに書き換える。
		 * 鍛錬ボタンの利用可否の操作も行う
		 * @param $pushButton jQuery 押されたボタンの jQuery オブジェクト
		 * @param forging number 鍛錬の上限値 (-1 or (+)1)
		 */
		_forging = function ( $pushButton, forging ) {
			/* 行頭 var 例外 */
			if ( $pushButton.hasClass( "disabled" ) ) {
				return;
			}

			var $card = $pushButton.parents( "[data-catalog]" ),
				forgeValue = $card.data( "forge" ) + forging;

			$card.data( "forge", forgeValue );

			CYPRESS.forging( $card, forgeValue );

			if ( forgeValue === 0 ) {
				$card.find( ".forging-plus" ).removeClass( "disabled" );
				$card.find( ".forging-minus" ).addClass( "disabled" );
			} else if ( forgeValue === 10 ) {
				$card.find( ".forging-plus" ).addClass( "disabled" );
				$card.find( ".forging-minus" ).removeClass( "disabled" );
			} else {
				$card.find( ".forging-plus" ).removeClass( "disabled" );
				$card.find( ".forging-minus" ).removeClass( "disabled" );
			}
		},
		/**
		 * 装備名をランダムに1つ返す。
		 * 検索ワードのプレースホルダに入れるため
		 * @return 装備名（文字列）
		 */
		_getEquipmentName = function () {
			return CYPRESS.EQUIPMENT[ _equipments[ Math.floor( Math.random() * _equipments.length ) ] ][ CYPRESS.COLUMN.NAME ];
		},
		/**
		 * UIから検索する（描写はしない）。
		 * 1: UIから検索条件を生成する
		 * 2: 生成した検索条件から一致する装備を検索する
		 * 3: ヒットしたレコード数をUIに描写する
		 */
		_search = function () {
			_equipments = CYPRESS.search( CYPRESS.makeRequest() );
			_writeRecords( _equipments.length );
		},
		/**
		 * UIから操作した内容を状態保持用変数にセットする。
		 * 各UIのイベント操作で利用
		 * @param category 分類
		 * @param ke       項目
		 * @param value    セットする値
		 */
		_setStatus = function ( category, key, value ) {
			CYPRESS.STATUS[ category ][ key ] = value;
		};

	return {
		getEquipmentName: _getEquipmentName,
		display: _display,
		forging: _forging,
		search: _search,
		setStatus: _setStatus
	};
} () );

$( document ).ready( function () { /** boot Cypress */
	"use strict";

	var mySlidebars = new $.slidebars();

	// widgets
	( function () {
		// initialize slidebars
		( function () {
			$( "#toolbox-button-box" ).click( function () {
				$( "#toolbox-button" ).toggleClass( "close" );
				return false;
			} );

			// @todo: debug
			// mySlidebars.slidebars.open( "right" );
		} () );

		// initialize ionRangeSlider
		( function () {
			$( "#grade-range" ).ionRangeSlider( {
				type: "double",
				min: 1,
				max: CYPRESS.CONSTS.CAP.GRADE,
				hide_min_max: true,
				values_separator: "-",
				onFinish: CYPRESS.Manager.search
			} );

			$( "#level-range" ).ionRangeSlider( {
				type: "double",
				min: 1,
				max: CYPRESS.CONSTS.CAP.LEVEL,
				hide_min_max: true,
				values_separator: "-",
				onFinish: CYPRESS.Manager.search
			} );
		} () );

		// initialize colorbox
		( function () {
			$( "#choice-types" ).colorbox( {
				inline: true,
				href: "#dialog-types",
				closeButton: false,
				transition: "none",
				onClosed: function () {
					CYPRESS.Manager.search();
				}
			} );

			$( "#choice-flags" ).colorbox( {
				inline: true,
				href: "#dialog-flags",
				closeButton: false,
				transition: "none",
				onClosed: function () {
					CYPRESS.Manager.search();
				}
			} );
		} () );

		// initialize icheck
		( function () {
			var iCheckInitialize = function () {
					var $self = $( this ),
						label = $self.data( "label" );

					$self.iCheck( {
						checkboxClass: "icheckbox",
						radioClass: "icheckbox",
						insert: "<div class=\"icheck-icon\"></div>" + label
					} );
				},
				iCheckInitializeRarities = function () {
					var $self = $( this ),
						label = $self.data( "label" );

					$self.iCheck( {
						checkboxClass: "icheckbox " + label.toLowerCase(),
						insert: "<div class=\"icheck-icon\"></div>" + label
					} );
				},
				statusChange = function ( category ) {
					return function ( event ) {
						var $self = $( this ),
							label = $self.data( "label" );

						CYPRESS.Manager.setStatus( category, label, $self.prop( "checked" ) );

						CYPRESS.Manager.search();
					};
				};

			$( "#query-rarities input" )
			.each( iCheckInitializeRarities )
			.on( "ifChanged", statusChange( "rarity" ) );

			$( "#query-classes input" )
			.each( iCheckInitialize )
			.on( "ifChanged", statusChange( "class" ) );

			$( "#dialog-types .control-box input" )
			.each( iCheckInitialize );

			$( "#wrap-weapons input, #wrap-protective-gear input, #wrap-accessories input" )
			.on( "ifChanged", function ( event ) {
				var $self = $( this ),
					label = $self.data( "label" );

				CYPRESS.Manager.setStatus( "type", label, $self.prop( "checked" ) );
			} );

			$( "#dialog-flags .control-box input" )
			.each( iCheckInitialize );
		} () );
	} () );

	// bind events
	( function () {
		// #dialog-types
		( function () {
			var m2s = function ( category, simples ) {
					return function ( event ) {
						var state = $( "#query-" + category ).prop( "checked" ) ? "check" : "uncheck";

						$( simples ).each( function () {
							$( this ).iCheck( state );
						} );
					};
				},
				s2m = function ( category, wrap ) {
					return function ( event ) {
						var inputElements = $( wrap ).length,
							checkedElements = $( wrap + ":checked" ).length;

							   if ( checkedElements === inputElements ) {
							$( "#query-" + category ).iCheck( "check" );
						} else if ( checkedElements === 0 ) {
							$( "#query-" + category ).iCheck( "uncheck" ).iCheck( "determinate" );
						} else {
							$( "#query-" + category ).iCheck( "indeterminate" );
						}
					};
				},
				addHover = function ( simples ) {
					return function ( event ) {
						$( simples ).each( function () {
							$( this ).parent().addClass( "hover" );
						} );
					};
				},
				removeHover = function ( simples ) {
					return function ( event ) {
						$( simples ).each( function () {
							$( this ).parent().removeClass( "hover" );
						} );
					};
				};

			$.each( [ "weapons", "protective-gear", "accessories" ], function ( key, category ) {
				var simples = "#wrap-" + category + " input";

				// multiple -> simple
				$( "#query-" + category )
				.on( "ifToggled", m2s( category, simples ) )
				.on( "ifDeterminate", m2s( category, simples ) )
				.next().next()
				.mouseover( addHover( simples ) )
				.mouseout( removeHover( simples ) );

				// simple -> multiple
				$( simples ).on( "ifToggled", s2m( category, simples ) );
			} );

			$.each( [ "head", "torso", "legs", "arms", "feet", "shields" ], function( key, category ) {
				var simples = "#wrap-protective-gear ." + category;

				// multiple -> simple
				$( "#query-" + category ).on( "ifToggled", m2s( category, simples ) )
				.next().next()
				.mouseover( addHover( simples ) )
				.mouseout( removeHover( simples ) );

				// simple -> multiple
				$( simples ).on( "ifToggled", s2m( category, simples ) );
			} );

			$( "#dialog-types-reset" ).bind( "click", function () {
				$.each( [ "weapons", "protective-gear", "accessories" ], function ( key, category  ) {
					$( "#query-" + category ).iCheck( "uncheck" ).iCheck( "determinate" );
				} );
			} );

			$( "#dialog-types-close" ).bind( "click", function () {
				$.colorbox.close();
			} );
		} () );

		// #dialog-flags
		( function () {
			$.each( [ "all", "only", "eliminate" ], function ( key, choice ) {
				$( "#dialog-flags ." + choice ).on( "ifChecked", function ( event ) {
					CYPRESS.Manager.setStatus( "flag", $( this ).data( "flag" ), choice );
				} );
			} );

			$( "#dialog-flags-reset" ).bind( "click", function () {
				$( "#dialog-flags .all" ).iCheck( "check" );
			} );

			$( "#dialog-flags-close" ).bind( "click", function () {
				$.colorbox.close();
			} );
		} () );

		// Text field and Buttons
		( function () {
			var $usage = $( "#usage" );

			$usage.remove();

			$( "#equipment-name" ).bind( "change", function () {
				CYPRESS.Manager.search();
			} );

			$( "#search-button-main, #search-button-sub" ).bind( "click", function () {
				CYPRESS.Manager.display();
				mySlidebars.slidebars.close();
				$( "#toolbox-button" ).removeClass( "close" );
			} );

			$( "#reqiest-reset-button" ).click( function () {
				$( "#equipment-name" ).val( "" );
				$( "#grade-range" ).data( "ionRangeSlider" ).reset();
				$( "#level-range" ).data( "ionRangeSlider" ).reset();
				$( "#query-rarities input" ).each( function () {
					$( this ).iCheck( "uncheck" );
				} );
				$( "#query-classes input" ).each( function () {
					$( this ).iCheck( "uncheck" );
				} );
				$( "#dialog-types-reset" ).click();
				$( "#dialog-flags-reset" ).click();

				CYPRESS.Manager.search();
			} );

			$( "#usage-button" ).bind( "click", function () {
				// memo: すでに要素があっても多重に追加されない
				$( "#equipments" ).prepend( $usage );

				$( "#usage-button" ).prop( "disabled", true );
			} );
		} () );

		//
		( function () {
			$( "#equipments" ).on( {
				"click": function () {
					CYPRESS.Manager.forging( $( this ), 1 );
				},
				"mouseenter": function () {
					$( "#tool-commentary" ).text( "forging-plus" );
				},
				"mouseleave": function () {
					$( "#tool-commentary" ).text( "" );
				}
			}, ".forging-plus" );

			$( "#equipments" ).on( {
				"click": function () {
					CYPRESS.Manager.forging( $( this ), -1 );
				},
				"mouseenter": function () {
					$( "#tool-commentary" ).text( "forging-minus" );
				},
				"mouseleave": function () {
					$( "#tool-commentary" ).text( "" );
				}
			}, ".forging-minus" );

			$( "#equipments" ).on( {
				"click": function () {
					$( "#tool-commentary" ).text( "copied!" );
				},
				"mouseenter": function () {
					$( "#tool-commentary" ).text( "copy" );
				},
				"mouseleave": function () {
					$( "#tool-commentary" ).text( "" );
				}
			}, ".data-copy" );
		} () );
	} () );

	// initialize UIs
	$( "#reqiest-reset-button" ).click();
	// @todo release
//	$( "#usage-button" ).click();
	// @todo debug
	CYPRESS.displayEquipmentCard( [16301,319200,806201,801114,5412200,4220101,115200,1020300,317300,1120300,1301100,4503201,4618201,4707300] );
	/* サンプル選定理由
	16301   血色の爪 [ 物理攻撃 100 ]
	319200  シャムロック [ 魔法攻撃 100 ]
	806201  粉砕の金剛棒 [ 耐久値 100 ]
	801114  マジカルラブリーステッキ [ 重量 <0.2 ]
	5412200 上質な平等主義者の帯 [ 重量 <0.4 ]
	4220101 ディフツィートブーツ [ 重量 <1.0 ]
	115200  水晶石の短剣 [ 重量 <2.0 ]
	1020300 ミストール [ 重量 <4.0 ]
	317300  ジオグラフバスター [ 重量 4.0< ]
	1120300 オデッサ [ 弓 ]
	1301100 愛の告白 [ 銃 ]
	4503201 悪霊の盾 [ 小型盾 ]
	4618201 司祭の盾 [ 中型盾 ]
	4707300 黄泉の大楯 [ 大型盾 ]
	*/
	$( "#equipment-name" ).prop( "placeholder", "例：" + CYPRESS.Manager.getEquipmentName() );
} );
