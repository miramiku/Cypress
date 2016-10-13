/*global CYPRESS */

/**
 * Documents: Cypress.Retrieval APIs
 * url: https://miramiku.github.io/post/wizon/cypress/retrieval-apis/
 */

/* Global Consts */
/**
 * 鍛錬値データ
 * ref:https://miramiku.github.io/post/wizon/cypress/forging-data/
 */
CYPRESS.CONSTS.FORGING_DATA = {
	QUALITY: [ 1.00, 1.05, 1.15, 1.27, 1.39, 1.54, 1.69, 1.84, 1.99, 2.14, 2.29 ],
	GP: { "小型盾":  5, "中型盾": 10, "大型盾": 15 },
	WEIGHT: [
		//               0   +1   +2   +3   +4   +5   +6   +7   +8   +9  +10
		/* < 0.2  */ [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0 ],
		/* < 0.4  */ [ 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1 ],
		/* < 1.0  */ [ 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2 ],
		/* < 2.0  */ [ 0.0, 0.0, 0.0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.2, 0.3, 0.3 ],
		/* < 4.0  */ [ 0.0, 0.0, 0.1, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.3, 0.4 ],
		/* 4.0 <= */ [ 0.0, 0.1, 0.1, 0.2, 0.2, 0.3, 0.3, 0.4, 0.4, 0.5, 0.5 ]
	],
	//       0  +1  +2  +3  +4  +5  +6   +7   +8   +9  +10
	RANGE: [ 0, 10, 20, 30, 40, 60, 80, 100, 120, 150, 200 ],
	SPECIAL_QUALITY: {
		//      0 +1 +2 +3 +4 +5  +6  +7  +8  +9 +10
		"弓": [ 0, 0, 0, 1, 2, 3,  4,  5,  7, 10, 15 ],
		"銃": [ 0, 1, 2, 4, 6, 9, 12, 16, 21, 28, 43 ]
	}
};

/** 標準装備下限レベル（定数） */
CYPRESS.CONSTS.STANDARD_LEVEL_FLOOR = [
	/* no-Grade */  1,
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
	/* Grade 20 */ 50,
	/* Grade 21 */ 52,
	/* Grade 22 */ 54,
	/* Grade 23 */ 56,
	/* Grade 24 */ 58,
	/* Grade 25 */ 60
];

/** 表示用装備データ生成に関する集合・ベクトル */
CYPRESS.EQUIPMENT_STYLE = {
	ORDERS: {// 表示順序定義
		CLASSES:             [ "FIG", "THI", "MAG", "PRI", "SAM", "NIN", "BIS", "LOR", "CLO", "ALC" ],
		PHYSICAL_ATTRIBUTES: [ "SLASH", "STRIKE", "PIERCE" ],
		SPECIAL_EFFECTS:     [ "HP", "MP", "STR", "VIT", "DEX", "AGI", "INT", "PIE", "LUK" ],
		RESISTANCE:          [ "POISON", "PARALYZE", "PETRIFY", "FAINT", "BLIND", "SLEEP", "SILENCE", "CHARM", "CONFUSION", "FEAR" ],
		ATTRIBUTES:          [ "FIRE", "WATER", "WIND", "EARTH", "LIGHT", "DARK" ],
		FLAGS:               [ "SELL", "TRADE", "STOLEN", "BLESSED", "CURSED", "BIND" ]
	},
	REGEXP: { // 条件分岐用正規表現
		DISABLE_FORGE:               /^Legend$|^Artifact$/,
		RANGED_WEAPONS:              /^弓$|^銃$/,
		SHOTS:                       /^矢$|^銃弾$/,
		ACCESSORIES:                 /^指輪$|^耳飾り$|^首飾り$|^ベルト$/,
		SHIELDS:                     /^[大中小]型盾$/,
		WITHOUT_PHYSICAL_ATTRIBUTES: /^弓$|^銃$|^指輪$|^耳飾り$|^首飾り$|^ベルト$/, // RANGED_WEAPONS + ACCESSORIES
		WITH_SPECIAL_PROPERTIES:     /^弓$|^銃$|^矢$|^銃弾$|^[大中小]型盾$/        // RANGED_WEAPONS + SHOTS + SHIELDS
	}
};

/* Global Fields */
CYPRESS.SORT_CONFIG = {
	category: "CATALOG",
	key: "CATALOG",
	order: "ASC"
};

CYPRESS.STATUS = {
	"rarity": {
		"Poor":     false,
		"Normal":   false,
		"Good":     false,
		"Master":   false,
		"Epic":     false,
		"Legend":   false,
		"Artifact": false,
		"Other":    false
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
		"bind":          "all",
		"sell":          "all",
		"trade":         "all",
		"stolen":        "all"
	}
};

/** データ構築に共通する処理をまとめたクラス */
CYPRESS.BuilderUtils = {
	isWeapon: function ( type ) {
		"use strict";

	//  WEAPONS: [ "暗器", "短剣", "片手剣", "両手剣", "刀", "片手斧", "両手斧", "槍", "片手鈍器", "両手鈍器", "両手杖", "弓", "矢", "銃", "銃弾", "双刃" ]
	//  GUARDS:  [ "兜", "帽子", "頭巾", "鎧", "上衣", "外衣", "手甲", "手袋", "腕輪", "脚鎧", "下衣", "鉄靴", "革靴", "靴", "小型盾", "中型盾", "大型盾", "外套", "指輪", "耳飾り", "首飾り", "ベルト" ]

		return 0 <= $.inArray( type, [ "暗器", "短剣", "片手剣", "両手剣", "刀", "片手斧", "両手斧", "槍", "片手鈍器", "両手鈍器", "両手杖", "弓", "矢", "銃", "銃弾", "双刃" ] );
	}
};

/**
 * 鍛錬をシミュレートして鍛錬後の装備データオブジェクトの装備データを書き換える
 * @param Object equipment 装備データオブジェクト
 */
CYPRESS.forging = function ( equipment ) {
	"use strict";

	var COLUMN = CYPRESS.COLUMN,
		FORGING_DATA = CYPRESS.CONSTS.FORGING_DATA,
		REGEXP = CYPRESS.EQUIPMENT_STYLE.REGEXP,

		BASE = CYPRESS.EQUIPMENT[ equipment.catalog ],
		TYPE = BASE[ COLUMN.TYPE ],
		WEIGHT = BASE[ COLUMN.WEIGHT ],

		FORGE = equipment.forge,
		RECORD = equipment.equipment,

		WEIGHT_CLASSS = ( function () {
				   if ( WEIGHT < 0.20 ) {
				return 0;
			} else if ( WEIGHT < 0.40 ) {
				return 1;
			} else if ( WEIGHT < 1.00 ) {
				return 2;
			} else if ( WEIGHT < 2.00 ) {
				return 3;
			} else if ( WEIGHT < 4.00 ) {
				return 4;
			} else {
				return 5;
			}
		} () );

	RECORD[ COLUMN.NAME ]     = BASE[ COLUMN.NAME ] + ( 0 < FORGE ? "+" + FORGE : "" );
	RECORD[ COLUMN.PHYSICAL ] = Math.floor( BASE[ COLUMN.PHYSICAL ] * FORGING_DATA.QUALITY[ FORGE ] );
	RECORD[ COLUMN.MAGICAL ]  = Math.floor( BASE[ COLUMN.MAGICAL ]  * FORGING_DATA.QUALITY[ FORGE ] );
	RECORD[ COLUMN.WEIGHT ]   = WEIGHT - FORGING_DATA.WEIGHT[ WEIGHT_CLASSS ][ FORGE ];

	if ( !REGEXP.ACCESSORIES.test( TYPE ) ) {
		RECORD[ COLUMN.DURABILITY ] = Math.floor( BASE[ COLUMN.DURABILITY ] * ( 1 + ( FORGE / 10 ) ) );
		RECORD[ COLUMN.HARDNESS ]   = BASE[ COLUMN.HARDNESS ] + Math.floor( FORGE / 5 );
	}

	// 排他的な条件なので else if を利用
	if ( REGEXP.SHIELDS.test( TYPE ) ) {
		RECORD[ COLUMN.QUALITY ] = BASE[ COLUMN.QUALITY ] + FORGE * FORGING_DATA.GP[ TYPE ];
	} else if ( REGEXP.RANGED_WEAPONS.test( TYPE ) ) {
		RECORD[ COLUMN.RANGE ]   = BASE[ COLUMN.RANGE ]   + FORGING_DATA.RANGE[ FORGE ];
		RECORD[ COLUMN.QUALITY ] = BASE[ COLUMN.QUALITY ] + FORGING_DATA.SPECIAL_QUALITY[ TYPE ][ FORGE ];
	}
};

/**
 * EquipmentCardの内容 (HTML) を取得するする。
 * @param equipment Object 装備データ
 * @return HTML 装備データカード
 */
CYPRESS.getEquipmentCard = function ( equipment ) {
	"use strict";

		// consts
	var COLUMN               = CYPRESS.COLUMN,
		CLASSMASKS           = CYPRESS.CONSTS.CLASSMASKS,
		STANDARD_LEVEL_FLOOR = CYPRESS.CONSTS.STANDARD_LEVEL_FLOOR,
		ORDERS               = CYPRESS.EQUIPMENT_STYLE.ORDERS,
		REGEXP               = CYPRESS.EQUIPMENT_STYLE.REGEXP,

		// dependence
		BuilderUtils = CYPRESS.BuilderUtils,

		// field
		record = equipment.equipment,
		type = record[ COLUMN.TYPE ],

		// method
		buildCard = {
			card: "",

			buildTransfarTagData: function ( column, content ) {
				this.card += "<span class=\"" + column + "\">" + ( record[ COLUMN[ column.toUpperCase() ] ] ? "" : content ) + "</span>";
			},
			buildSupplimentTagData: function ( column, text ) {
				if ( record[ COLUMN[ column.toUpperCase() ] ] ) {
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
				var value = record[ column ];

				this.card += "<span class=\"" + className + ( value === 0 ? " zero" : " positive" ) + "\">" + value + "</span>";

				return this;
			},
			signedInteger: function ( className, column ) {
				var value = record[ column ],
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
				this.card += "<span class=\"" + className + "\">" + record[ column ] + "</span>";
				return this;
			},

			// concrete
			ribbon: function () {
				this.card += "<span class=\"ribbon " + record[ COLUMN.RARITY ].toLowerCase() + "\"></span>";
				return this;
			},
			copy: function () {
				this.card += "<button class=\"data-copy\">&#xe604;</button>";
				return this;
			},
			rarity: function () {
				this.direct( "rarity", COLUMN.RARITY );
				return this;
			},
			type: function () {
				this.direct( "type", COLUMN.TYPE );
				return this;
			},
			level: function () {
				var STDLVF = STANDARD_LEVEL_FLOOR[ record[ COLUMN.GRADE ] ],
					floor  = record[ COLUMN.LEVEL_FLOOR ],
					ceil   = record[ COLUMN.LEVEL_CEIL ],

					floorText = "Lv " + floor,
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
			grade: function () {
				var grade = record[ COLUMN.GRADE ];

				this.card += grade ? "<span class=\"grade\">" + grade + "</span>" : "";

				return this;
			},
			name: function () {
				this.direct( "name", COLUMN.NAME );
				return this;
			},
			restriction: function () {
				this.direct( "restriction", COLUMN.RESTRICTION );
				return this;
			},
			powers: function () {
				var offenseOrDefense = BuilderUtils.isWeapon( type ) ? "weapons" : "guards";

				this.card += "<span class=\"physical " + offenseOrDefense + "\">" + record[ COLUMN.PHYSICAL ] + "</span>" +
							 "<span class=\"magical "  + offenseOrDefense + "\">" + record[ COLUMN.MAGICAL ] + "</span>";

				return this;
			},
			whenEquipped: function () {
				this.card += record[ COLUMN.WHEN_EQUIPPED ] === "" ?
					"<span class=\"when-equipped zero\"></span>" :
					( "<span class=\"when-equipped " + ( record[ COLUMN.WEPN ] ? "positive" : "negative" ) +"\">" + record[ COLUMN.WHEN_EQUIPPED ] + "</span>" );
				return this;
			},
			statusChange: function () {
				this.card += 0 < record[ COLUMN.PERCENT ] ?
					( "<span class=\"status-change " + ( record[ COLUMN.SCPN ] ? "positive" : "negative" ) +"\">" + record[ COLUMN.STATUS_CHANGE ] + " (" + record[ COLUMN.PERCENT ] + "%)</span>" ) :
					"<span class=\"status-change zero\"></span>";
				return this;
			},
			classRestriction: function () {
				var cr = record[ COLUMN.CLASS ],
					buildClassIcon = function ( cls ) {
						return "<span class=\"" + cls.toLowerCase() + " " + ( cr & CLASSMASKS[ cls ] ? "equipable" : "non-equipable" ) + "\">" + cls + "</span>";
					},
					that = this;

				this.group( "class-restriction-line" );

				this.group( "class-restriction" );
				$.each( ORDERS.CLASSES, function () {
					that.card += buildClassIcon( this );
				} );
				this.end();
				this.card += "<span class=\"enchant\">" +
							 ( record[ COLUMN.ENCHANT ] === -1 ? "N/A" : record[ COLUMN.ENCHANT ] ) +
							 "</span>";

				this.end();

				return this;
			},

			// complex
			transfarTags: function () {
				this.buildTransfarTagData( "sell", "[売却不可]" );
				this.buildTransfarTagData( "trade", "[トレード不可]" );
				this.buildSupplimentTagData( "bind", "使用後トレード不可" );
				this.buildTransfarTagData( "stolen", "<img src=\"images/stolen.png\" alt=\"略奪されない\">略奪されない" );

				return this;
			},
			supplimentTags: function () {
				this.buildSupplimentTagData( "blessed", "祝福されている" );
				this.buildSupplimentTagData( "cursed", "呪われている" );

				return this;
			},
			physicalAttributes: function () {
				var that = this;

				if ( !REGEXP.WITHOUT_PHYSICAL_ATTRIBUTES.test( type ) ) {
					this.group( "physical-attributes" );
					this.label( "物理属性" );
					$.each( ORDERS.PHYSICAL_ATTRIBUTES, function () {
						that.card += "<span class=\"" + this.toLowerCase() + "\">" + record[ COLUMN[ this ] ] + "</span>";
					} );
					this.end();
				}

				return this;
			},
			properties: function () {
				if ( REGEXP.ACCESSORIES.test( type ) ) {
					this.card += "<span class=\"weight\">"     + record[ COLUMN.WEIGHT ].toFixed( 2 ) + "</span>";
				} else if ( REGEXP.SHOTS.test( type ) ) {
					this.card += "<span class=\"hardness\">"   + record[ COLUMN.HARDNESS ]            + "</span>" +
								 "<span class=\"weight\">"     + record[ COLUMN.WEIGHT ].toFixed( 2 ) + "</span>";
				} else {
					this.card += "<span class=\"durability\">" + record[ COLUMN.DURABILITY ]          + "</span>" +
								 "<span class=\"hardness\">"   + record[ COLUMN.HARDNESS ]            + "</span>" +
								 "<span class=\"weight\">"     + record[ COLUMN.WEIGHT ].toFixed( 2 ) + "</span>";
				}

				return this;
			},
			specialPropertiesLine: function () {
				var content = {
					"弓": function () {
						return "<span class=\"range\">"             + record[ COLUMN.RANGE ]         + "</span>" +
							   "<span class=\"quality bows\">"      + record[ COLUMN.QUALITY ]       + "</span>";
					},
					"矢": function () {
						var range     = record[ COLUMN.RANGE ],
							quality   = record[ COLUMN.QUALITY ];

						return "<span class=\"range-rate" +        (range   !== 100 ? range   < 100 ? " negative" : " positive" : "") + "\">" + range   + "%</span>" +
							   "<span class=\"quality-rate bows" + (quality !== 100 ? quality < 100 ? " negative" : " positive" : "") + "\">" + quality + "%</span>";
					},
					"銃": function () {
						return "<span class=\"range\">"             + record[ COLUMN.RANGE ]         + "</span>" +
							   "<span class=\"quality guns\">"      + record[ COLUMN.QUALITY ]       + "</span>" +
							   "<span class=\"charge-weight\">"     + record[ COLUMN.CHARGE_WEIGHT ] + "</span>";
					},
					"銃弾": function () {
						var range     = record[ COLUMN.RANGE ],
							quality   = record[ COLUMN.QUALITY ];

						return "<span class=\"range-rate" +        (range   !== 100 ? range   < 100 ? " negative" : " positive" : "") + "\">" + range   + "%</span>" +
							   "<span class=\"quality-rate guns" + (quality !== 100 ? quality < 100 ? " negative" : " positive" : "") + "\">" + quality + "%</span>";
					},
					"小型盾": function () {
						var gp = record[ COLUMN.QUALITY ];
						return gp ? "<span class=\"quality gp\">" + gp                       + "</span>" : "";
					},
					"中型盾": function () {
						return      "<span class=\"quality gp\">" + record[ COLUMN.QUALITY ] + "</span>";
					},
					"大型盾": function () {
						return      "<span class=\"quality gp\">" + record[ COLUMN.QUALITY ] + "</span>";
					}
				};

				if ( REGEXP.WITH_SPECIAL_PROPERTIES.test( type ) ) {
					this.group( "special-properties" );
					this.card += content[ type ]();
					this.end();
				}

				return this;
			},
			specialEffectsLine: function () {
				var specialEffects = ( function () {
							var obj = {};

							$.each( ORDERS.SPECIAL_EFFECTS, function () {
								obj[ this ] = record[ COLUMN[ this ] ];
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
					$.each( ORDERS.SPECIAL_EFFECTS, function () {
						that.signedInteger( this.toLowerCase(), COLUMN[ this ] );
					} );
					this.end();
				}

				return this;
			},
			resistanceLine: function () {
				var resistance = ( function () {
							var obj = {};

							$.each( ORDERS.RESISTANCE, function () {
								obj[ this ] = record[ COLUMN[ this ] ];
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
					$.each( ORDERS.RESISTANCE, function () {
						that.unsignedInteger( this.toLowerCase(), COLUMN[ this ] );
					} );
					this.end();
				}

				return this;
			},
			magicAttributesLine: function () {
				var label = {
						ATTACK: "魔攻属性",
						RESIST: "魔防属性"
					},
					that = this,
					attributes = ( function () {
						var setAttributes = function ( type ) {
								var obj = {};

								$.each( ORDERS.ATTRIBUTES, function () {
									 obj[ this ] = record[ COLUMN[ this + "_" + type ] ];
								} );

								return obj;
							};

						return {
							ATTACK: setAttributes( "ATTACK" ),
							RESIST: setAttributes( "RESIST" )
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
							ATTACK: checkAllZero( "ATTACK" ),
							RESIST: checkAllZero( "RESIST" )
						};
					} () ),
					build = function ( type ) {
						that.group( type );
						that.label( label[ type ] );
						if ( !isAllZero[ type ] ) {
							$.each( attributes[ type ], function ( atr, val ) {
								that.signedInteger( atr.toLowerCase(), COLUMN[ atr + "_" + type ] );
							} );
						} else {
							that.card += "<span class=\"allZero\">補正なし</span>";
						}
						that.end();
					};

				if ( !isAllZero.ATTACK || !isAllZero.RESIST ) {
					this.group( "magic-attributes" );
					build( "ATTACK" );
					build( "RESIST" );
					this.end();
				}

				return this;
			},
			otherDataLine: function () {
				var whenEquipped = record[ COLUMN.WHEN_EQUIPPED ],
					statusChange = record[ COLUMN.STATUS_CHANGE ];

				if ( whenEquipped !== "" || statusChange !== "" ) {
					this.group( "other-data" );
					this.card += whenEquipped === "" ?
						"<span class=\"when-equipped zero\"></span>" :
						( "<span class=\"when-equipped " + ( record[ COLUMN.WEPN ] ? "positive" : "negative" ) +"\">" + record[ COLUMN.WHEN_EQUIPPED ] + "</span>" );
					this.card += statusChange === "" ?
						"<span class=\"status-change zero\"></span>":
						( "<span class=\"status-change " + ( 0 < record[ COLUMN.PERCENT ] ? "positive" : "negative" ) +"\">" + record[ COLUMN.STATUS_CHANGE ] + " (" + Math.abs( record[ COLUMN.PERCENT ] ) + "%)</span>" );
					this.end();
				}

				return this;
			},
			notesLine: function () {
				var LABEL = 0,
					TEXT = 1,
					lines = {
						comments: [ "コメント", record[ COLUMN.COMMENTS ] ],
						sources:  [ "入手方法", record[ COLUMN.SOURCES ] ],
						notes:    [ "ノート",  record[ COLUMN.NOTES ] ]
					},
					that = this;

				if ( lines.comments[ TEXT ] + lines.sources[ TEXT ] + lines.notes[ TEXT ] !== "" ) {
					this.group( "notes-line" );
					this.sectionDivider();

					$.each( [ "comments", "sources", "notes" ], function () {
						if ( lines[ this ][ TEXT ] !== "" ) {
							that.card += "<div class=\"" + this + "\"><span class=\"" + this + "-label\">" + lines[ this ][ LABEL ] + "：</span><span class=\"" + this + "-text\">" + lines[ this ][ TEXT ] + "</span></div>";
						}
					} );

					this.end();
				}

				return this;
			},
			toolbox: function () {
				var forge = equipment.forge,
					ableForge = ( function () {
						if ( REGEXP.DISABLE_FORGE.test( record[ COLUMN.RARITY ] ) ) {
							return " disabled";
						} else if ( REGEXP.SHOTS.test( type ) ) {
							return " disabled";
						}
						return "";
					} () );

				       if ( forge === 0  ) {
					this.card += "<div class=\"toolbox\"><div class=\"tool-buttons\">" +
								 "<span class=\"tool-button forging-plus" + ableForge + "\">+1</span>" +
								 "<span class=\"tool-button forging-minus disabled\">-1</span>" +
								 "</div></div>";
				} else if ( forge === 10 ) {
					this.card += "<div class=\"toolbox\"><div class=\"tool-buttons\">" +
								 "<span class=\"tool-button forging-plus disabled\">+1</span>" +
								 "<span class=\"tool-button forging-minus\">-1</span>" +
								 "</div></div>";
				} else {
					this.card += "<div class=\"toolbox\"><div class=\"tool-buttons\">" +
								 "<span class=\"tool-button forging-plus\">+1</span>" +
								 "<span class=\"tool-button forging-minus\">-1</span>" +
								 "</div></div>";
				}
				return this;
			}
		};

	// construct!
	buildCard
		.group( "equipment-card-inner" )
			.ribbon()
			.copy()
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
		.toolbox();

	return buildCard.card;
};

/**
 * カタログ番号からカードを表示する。
 * @param equipments array 装備オブジェクトの配列
 */
CYPRESS.displayEquipmentCard = function ( equipments ) {
	"use strict";

	$( "#equipments" ).empty();
	$( "#usage-button" ).prop( "disabled", false );

	$.each( equipments, function () {
		$( "#equipments" ).append( "<div class=\"equipment-card\" data-catalog=\"" + this.catalog + "\">" +
								       CYPRESS.getEquipmentCard( this ) +
								   "</div>" );
	} );
};

/**
 * 装備データの文字列表現を返す（コピーテキスト用）
 * @param record （鍛錬済）装備のレコード
 * @return string 装備データの文字列表現
 */
CYPRESS.getEquipmentString = function ( equipment ) {
	"use strict";

		// consts
	var COLUMN               = CYPRESS.COLUMN,
		CLASSMASKS           = CYPRESS.CONSTS.CLASSMASKS,
		ORDERS               = CYPRESS.EQUIPMENT_STYLE.ORDERS,
		REGEXP               = CYPRESS.EQUIPMENT_STYLE.REGEXP,

		// dependence
		BuilderUtils = CYPRESS.BuilderUtils,

		// method
		buildString = {
			string: "",

			basic: function () {
				this.string += equipment[ COLUMN.NAME ] + " " +
							   "グレード" + equipment[ COLUMN.GRADE ] + " " +
							   equipment[ COLUMN.RARITY ] + " " +
							   equipment[ COLUMN.TYPE ] + " / ";

				return this;
			},
			property: function () {
				var type = equipment[ COLUMN.TYPE ],
					offenseOrDefense = BuilderUtils.isWeapon( type ) ? "攻撃力" : "防御力";

				this.string += "物理" + offenseOrDefense + "：" + equipment[ COLUMN.PHYSICAL ] + " " +
							   "魔法" + offenseOrDefense + "：" + equipment[ COLUMN.MAGICAL ] + " ";

				switch ( type ) {
				case "弓": // 射程距離/溜め性能
					this.string += "射程距離：" + equipment[ COLUMN.RANGE ]   + " " +
								   "溜め性能：" + equipment[ COLUMN.QUALITY ] + " ";
					break;
				case "弓矢": // 射程効率/溜め効率
					this.string += "射程効率：" + equipment[ COLUMN.RANGE ]   + "% " +
								   "溜め効率：" + equipment[ COLUMN.QUALITY ] + "% ";
					break;
				case "銃": // 射程距離/装填性能/装填数
					this.string += "射程距離：" + equipment[ COLUMN.RANGE ]         + " " +
								   "装填性能：" + equipment[ COLUMN.QUALITY ]       + " " +
								   "装填数："   + equipment[ COLUMN.CHARGE_WEIGHT ] + " ";
					break;
				case "銃弾": // 射程効率/装填効率
					this.string += "射程効率：" + equipment[ COLUMN.RANGE ]   + "% " +
								   "装填効率：" + equipment[ COLUMN.QUALITY ] + "% ";
					break;
				case "小型盾": // GP
				case "中型盾":
				case "大型盾":
					this.string += "GP：" + equipment[ COLUMN.QUALITY ] + " ";
					break;
				}

				if ( REGEXP.ACCESSORIES.test( type ) ) {
					this.string += "重量：" + equipment[ COLUMN.WEIGHT ].toFixed( 2 );
				} else if ( REGEXP.SHOTS.test( type ) ) {
					this.string += "重量：" + equipment[ COLUMN.WEIGHT ].toFixed( 2 ) + " " +
								   "硬度：" + equipment[ COLUMN.HARDNESS ]            + " ";
				} else {
					this.string += "耐久度：" + equipment[ COLUMN.DURABILITY ]        + " " +
								   "重量：" + equipment[ COLUMN.WEIGHT ].toFixed( 2 ) + " " +
								   "硬度：" + equipment[ COLUMN.HARDNESS ]            + " ";
				}

				if ( !REGEXP.WITHOUT_PHYSICAL_ATTRIBUTES.test( type ) ) {
					this.string += "物理属性：[ 斬" + equipment[ COLUMN.SLASH ] +
											" 打" + equipment[ COLUMN.STRIKE ] +
											" 突" + equipment[ COLUMN.PIERCE ] + " ]";
				}

				return this;
			},
			speciaEffects: function () {
				var data = ( function () {
						var data = [];

						$.each( ORDERS.SPECIAL_EFFECTS, function () {
							var offset = equipment[ COLUMN[ this ] ];
							if ( offset !== 0 ) {
								data.push( this + ( 0 < offset ? "+" + offset : offset ) );
							}
						} );

						return data;
					} () ),
					that = this;

				if ( 0 < data.length ) {
					this.string += " ステータス補正：";
					$.each( data, function () {
						that.string += this + " ";
					} );
					this.string = this.string.slice( 0, -1 );
				}

				return this;
			},
			magicAttributesOffsets: function () {
				var ATTRIBUTES_J = {
						"FIRE":  "火",
						"WATER": "水",
						"WIND":  "風",
						"EARTH": "地",
						"LIGHT": "光",
						"DARK":  "闇"
					},
					resist = ( function () {
						var data = [];

						$.each( ORDERS.ATTRIBUTES, function () {
							var offset = equipment[ COLUMN[ this + "_RESIST" ] ];
							if ( offset !== 0 ) {
								data.push( ATTRIBUTES_J[ this ] + ( 0 < offset ? "+" + offset : offset ) );
							}
						} );

						return data;
					} () ),
					attack = ( function () {
						var data = [];

						$.each( ORDERS.ATTRIBUTES, function () {
							var offset = equipment[ COLUMN[ this + "_ATTACK" ] ];
							if ( offset !== 0 ) {
								data.push( ATTRIBUTES_J[ this ] + ( 0 < offset ? "+" + offset : offset ) );
							}
						} );

						return data;
					} () ),
					that = this;

				if ( 0 < resist.length ) {
					this.string += " 魔法防御属性：";
					$.each( resist, function () {
						that.string += this + " ";
					} );
					this.string = this.string.slice( 0, -1 );
				}

				if ( 0 < attack.length ) {
					this.string += " 魔法攻撃属性：";
					$.each( attack, function () {
						that.string += this + " ";
					} );
					this.string = this.string.slice( 0, -1 );
				}

				return this;
			},
			resistances: function () {
				var data = ( function () {
						var data = [],
							RESISTANCE_J = {
								"POISON":    "毒",
								"PARALYZE":  "麻痺",
								"PETRIFY":   "石化",
								"FAINT":     "気絶",
								"BLIND":     "暗闇",
								"SLEEP":     "睡眠",
								"SILENCE":   "沈黙",
								"CHARM":     "魅了",
								"CONFUSION": "混乱",
								"FEAR":      "恐怖"
							};

						$.each( ORDERS.RESISTANCE, function () {
							var offset = equipment[ COLUMN[ this ] ];
							if ( offset !== 0 ) {
								data.push( RESISTANCE_J[ this ] + offset );
							}
						} );

						return data;
					} () ),
					that = this;

				if ( 0 < data.length ) {
					this.string += " 状態異常耐性：";
					$.each( data, function () {
						that.string += this + " ";
					} );
					this.string = this.string.slice( 0, -1 );
				}

				return this;
			},
			otherEffect: function () {
				var whenEquipped = equipment[ COLUMN.WHEN_EQUIPPED ],
					statusChange = equipment[ COLUMN.STATUS_CHANGE ];

				if ( whenEquipped !== "" ) {
					this.string += " 装備時に " + whenEquipped;
				}
				if ( statusChange !== "" ) {
					this.string += " 状態異常：" + statusChange + "(" + equipment[ COLUMN.PERCENT ] + "%)";
				}

				return this;
			},
			restrictions: function () {
				var levelText = ( function () {
						var ceil   = equipment[ COLUMN.LEVEL_CEIL ];

						return "Lv" + equipment[ COLUMN.LEVEL_FLOOR ] + "～" + ( ceil === -1 ? "" : "Lv " + ceil );
					} () ),
					classRestriction = ( function () {
						var ALL_CLASS = 511,
							cr = equipment[ COLUMN.CLASS ],
							classRestrictionText = "";

						if ( cr === ALL_CLASS ) {
							return "全職業 ";
						} else {
							$.each( ORDERS.CLASSES, function () {
								classRestrictionText += cr & CLASSMASKS[ this ] ? this + " " : "";
							} );
							return classRestrictionText;
						}

					} () ),
					restriction = equipment[ COLUMN.RESTRICTION ];
				// フラグ6種

				this.string += " / 装備条件：" +
							   classRestriction +
							   levelText;

				if ( restriction !== "" ) {
					this.string += ", " + restriction;
				}

				return this;
			},
			flags: function () {
				var flagsText = ( function () {
						var text = "";

						text += !equipment[ COLUMN.SELL ]    ? "売却不可 "         : "";
						text += !equipment[ COLUMN.TRADE ]   ? "トレード不可 "      : "";
						text += !equipment[ COLUMN.STOLEN ]  ? "略奪されない "      : "";
						text += equipment[ COLUMN.BLESSED ]  ? "祝福されている "    : "";
						text += equipment[ COLUMN.CURSED ]   ? "呪われている "      : "";
						text += equipment[ COLUMN.BIND ]     ? "使用後トレード不可 " : "";

						return text;
					} () );

				if ( flagsText !== "" ) {
					flagsText = flagsText.slice( 0, -1 );
					this.string += " / " + flagsText;
				}

				return this;
			}
		};

	buildString
		.basic()
		.property()
		.speciaEffects()
		.magicAttributesOffsets()
		.resistances()
		.otherEffect()
		.restrictions()
		.flags();

	return buildString.string;
};

CYPRESS.makeCompareFunction = function () {
	"use strict";

	var COLUMN = CYPRESS.COLUMN,
		CONFIG = CYPRESS.SORT_CONFIG,

		order = CONFIG.order === "ASC" ? 1 : -1,
		RARITY_CODE = {
			"Poor":     1,
			"Normal":   2,
			"Good":     3,
			"Master":   4,
			"Epic":     5,
			"Legend":   6,
			"Artifact": 7,
			"Other":    8
		},
		_compare = {
			LAXICOGRAPHIC: function () {
					return function ( a, b ) {
						return ( a.equipment[ COLUMN[ CONFIG.key ] ] > b.equipment[ COLUMN[ CONFIG.key ] ] ?  1 :
								 a.equipment[ COLUMN[ CONFIG.key ] ] < b.equipment[ COLUMN[ CONFIG.key ] ] ? -1 :
																											  0 ) * order;
					};
				},
			NUMERIC: function () {
					if ( CONFIG.key === "RARITY" ) { // 順序
						return function ( a, b ) {
							return ( RARITY_CODE[ a.equipment[ COLUMN.RARITY ] ] - RARITY_CODE[ b.equipment[ COLUMN.RARITY ] ] ) * order;
						};
					} else { // 数値項目
						return function ( a, b ) {
							return ( a.equipment[ COLUMN[ CONFIG.key ] ] - b.equipment[ COLUMN[ CONFIG.key ] ] ) * order;
						};
					}
				},
			CATALOG: function () {
				return function ( a, b ) {
					return a.catalog - b.catalog;
				};
			}
		};

	return _compare[ CONFIG.category ]();
};

/**
 * UIから検索条件の生成。
 * @return function 検索条件
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
				floor = parseInt( range[ 0 ], 10 ),
				ceil = parseInt( range[ 1 ], 10 );

			if ( floor === 0 ) {
				if ( ceil === CYPRESS.CONSTS.CAPS.GRADE ) {
					return function ( record ) { // case 1: 全範囲
						return true;
					};
				} else {
					return function ( record ) { // case 2: 上限を変更
						return record[ COLUMN.GRADE ] <= ceil;
					};
				}
			} else {
				if ( ceil === CYPRESS.CONSTS.CAPS.GRADE ) {
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
				floor = parseInt( range[ 0 ], 10 ),
				ceil = parseInt( range[ 1 ], 10 );

			if ( floor === 0 ) {
				if ( ceil === CYPRESS.CONSTS.CAPS.LEVEL ) {
					return function ( record ) { // case 1: 全範囲
						return true;
					};
				} else {
					return function ( record ) { // case 2: 上限を変更
						return record[ COLUMN.LEVEL_FLOOR ] <= ceil;
					};
				}
			} else {
				if ( ceil === CYPRESS.CONSTS.CAPS.LEVEL ) {
					return function ( record ) { // case 3: 下限を変更
						var equipmentCeil = record[ COLUMN.LEVEL_CEIL ];

						return floor <= ( equipmentCeil === -1 ? CYPRESS.CONSTS.CAPS.LEVEL : equipmentCeil );
					};
				} else {
					return function ( record ) { // case 4: 下限・上限とも変更
						var equipmentCeil = record[ COLUMN.LEVEL_CEIL ];

						return floor <= ( equipmentCeil === -1 ? CYPRESS.CONSTS.CAPS.LEVEL : equipmentCeil ) && record[ COLUMN.LEVEL_FLOOR ] <= ceil;
					};
				}
			}
		} () ),
		/** 職業フィルタ */
		_containsClasses = ( function () {
			var classMask = CYPRESS.CONSTS.CLASSMASKS,
				requireMask = ( function () {
					var mask = 0;

					$.each( CYPRESS.STATUS[ "class" ], function ( key, value ) {
						mask += ( value ? classMask[ key ] : 0 );
					} );

					return mask;
				} () );

			// memo: 1023: FIG -> ALC
			if ( requireMask === 0 || requireMask === 1023 ) {
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
		_filterBind         = _filterBooleanFlag( "bind",    false ),
		_filterSell         = _filterBooleanFlag( "sell",    true  ),
		_filterTrade        = _filterBooleanFlag( "trade",   true  ),
		_filterStolen       = _filterBooleanFlag( "stolen",  true  ),

		_request = function ( record ) {
			return _matchWord( record )          && // 文字列検索
				   _containsGradeRange( record ) && // グレード範囲
				   _containsLevelRange( record ) && // レベル範囲
				   _containsClasses( record )    && // 職業フィルタ
				   _containsRarities( record )   && // 品質フィルタ
				   _containsTypes( record )      && // 分類フィルタ
				   _filterWhenEquipped( record ) && // 「装備時に」
				   _filterStatusChange( record ) && // 「状態異常」
				   _filterBlessed( record )      && // 「祝福されている」
				   _filterCursed( record )       && // 「呪われている」
				   _filterBind( record )         && // 「使用後取引不可」
				   _filterSell( record )         && // 「NPC売却可否」
				   _filterTrade( record )        && // 「取引可否」
				   _filterStolen( record );         // 「略奪できない」
		};

	return _request;
};

/** Cypress 操作ファサード（クラス） */
CYPRESS.Manager = ( function () {
	"use strict";

	var _equipments = [], // private field
		_writeRecords = function ( records ) { // private function
			$( "#records" ).html( ( function () {
				switch ( records ) {
				case 0:
					$( "#retrieval-button-main, #retrieval-button-sub" ).prop( "disabled", true );
					return "<span class=\"no-records\">no records</span>";
				case CYPRESS.CONSTS.ALL_RECORDS:
					$( "#retrieval-button-main, #retrieval-button-sub" ).prop( "disabled", false );
					return "<span class=\"all-records\">" + CYPRESS.CONSTS.ALL_RECORDS + " (all) records</span>";
				default:
					$( "#retrieval-button-main, #retrieval-button-sub" ).prop( "disabled", false );
					return "<span>" + records + " records</span>";
				}
			} () ) );
		},
		/** 検索結果から装備一覧を描写する */
		_display = function () {
			_equipments.sort( CYPRESS.makeCompareFunction() );
			CYPRESS.displayEquipmentCard( _equipments );
		},
		/** 整理番号から編集済みの装備データを取得する */
		_getCurrentEquipment = function ( catalog ) {
			var last = _equipments.length,
				index = 0;

			do {
				if ( parseInt( _equipments[ index ].catalog, 10 ) === catalog ) {
					return _equipments[ index ];
				}
			} while( ( index += 1 ) !== last );

			return null;
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
				catalog = $card.data( "catalog" ),
				equipment = _getCurrentEquipment( catalog );

			equipment.forge += forging;

			CYPRESS.forging( equipment );
			$card.html( CYPRESS.getEquipmentCard( equipment ) );

			if ( equipment.forge === 0 ) {
				$card.find( ".forging-plus" ).removeClass( "disabled" );
				$card.find( ".forging-minus" ).addClass( "disabled" );
			} else if ( equipment.forge === 10 ) {
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
		 * @return string 装備名
		 */
		_getEquipmentName = function () {
			return _equipments[ Math.floor( Math.random() * ( _equipments.length - 1 ) ) ].equipment[ CYPRESS.COLUMN.NAME ];
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
		 * @param category string  分類
		 * @param key      string  項目
		 * @param value    boolean セットする値
		 */
		_setStatus = function ( category, key, value ) {
			CYPRESS.STATUS[ category ][ key ] = value;
		};

	return {
		display: _display,
		forging: _forging,
		getCurrentEquipment: _getCurrentEquipment,
		getEquipmentName: _getEquipmentName,
		search: _search,
		setStatus: _setStatus
	};
} () );

/** boot Cypress */
$( document ).ready( function () {
	"use strict";

	var mySlidebars = new $.slidebars();

	// widgets
	( function () {
		// initialize slidebars
		( function () {
			 mySlidebars.slidebars.open( "right" );
		} () );

		// initialize ionRangeSlider
		( function () {
			$( "#grade-range" ).ionRangeSlider( {
				"type": "double",
				"min": 0,
				"max": CYPRESS.CONSTS.CAPS.GRADE,
				"hide_min_max": true,
				"values_separator": "-",
				"onFinish": CYPRESS.Manager.search
			} );

			$( "#level-range" ).ionRangeSlider( {
				"type": "double",
				"min": 1,
				"max": CYPRESS.CONSTS.CAPS.LEVEL,
				"hide_min_max": true,
				"values_separator": "-",
				"onFinish": CYPRESS.Manager.search
			} );
		} () );

		// initialize colorbox
		( function () {
			$( "#choice-types" ).colorbox( {
				"inline": true,
				"href": "#dialog-types",
				"closeButton": false,
				"transition": "none",
				"onClosed": function () {
					CYPRESS.Manager.search();
				}
			} );

			$( "#choice-flags" ).colorbox( {
				"inline": true,
				"href": "#dialog-flags",
				"closeButton": false,
				"transition": "none",
				"onClosed": function () {
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
						"checkboxClass": "icheckbox",
						"radioClass": "icheckbox",
						"insert": "<div class=\"icheck-icon\"></div>" + label
					} );
				};

			// #retrieval-pane
			( function () {
				var iCheckInitializeRarities = function () {
						var $self = $( this ),
							label = $self.data( "label" );

						$self.iCheck( {
							"checkboxClass": "icheckbox " + label.toLowerCase(),
							"insert": "<div class=\"icheck-icon\"></div>" + label
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

			// #sort-pane
			( function () {
				var changeConfig = function ( category, key, order ) {
						var config = CYPRESS.SORT_CONFIG;

						config.category = category;
						config.key = key;
						config.order = order;
					},
					runSort = function () {
						if ( !$( "#usage" ).length ) {
							CYPRESS.Manager.display();
						}
					},
					checkedBehavior = function( category ) {
						return function () {
							changeConfig( $( this ).data( "category" ),
										  $( "#" + category + "-sort-list :checked" ).data( "key" ),
										  $( "#" + category + "-sort-order-change" ).data( "order" ) );

							$( "#" + category + "-sort-list" ).slideDown();
							$( "#" + category + "-sort-order-change" ).prop( "disabled", false );
						};
					},
					uncheckedBehavior = function( category ) {
						return function () {
							$( "#" + category + "-sort-list" ).slideUp();
							$( "#" + category + "-sort-order-change" ).prop( "disabled", true );
						};
					};
				$( "#sorting-pane [name=sort-category]" )
					.each( iCheckInitialize );

				$( "#lexicographic-sort-list input, #numeric-sort-list input" )
					.each( iCheckInitialize )
					.on( "ifClicked", function () {
						if ( $( this ).prop( "checked" ) ) {
							runSort();
						}
					} )
					.on( "ifChecked", function () {
						CYPRESS.SORT_CONFIG.key = $( this ).data( "key" );
						runSort();
					} );

				$( "#catalog-order" )
					.on( "ifChecked", function () {
						changeConfig( "CATALOG", "CATALOG", "ASC" );
						runSort();
					} );

				$( "#lexicographic-order" )
					.on( "ifChecked",     checkedBehavior( "lexicographic" ) )
					.on( "ifUnchecked", uncheckedBehavior( "lexicographic" ) );

				$( "#numeric-order" )
					.on( "ifChecked",     checkedBehavior( "numeric" ) )
					.on( "ifUnchecked", uncheckedBehavior( "numeric" ) );
			} () );
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
				$( "#query-" + category )
					.on( "ifToggled", m2s( category, simples ) )
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
			$( "#usage-button" ).bind( "click", function () {
				// memo: すでに要素があっても多重に追加されない
				$( "#equipments" ).prepend( $usage );
				$( "#usage-button" ).prop( "disabled", true );
			} );

			$( "#logo" ).bind( "click", function () {
				$( "body" ).animate( { scrollTop: 0 }, "slow", "swing" );
			} );

			$( "#equipment-name" ).bind( "change", CYPRESS.Manager.search );

			$( "#retrieval-button-main, #retrieval-button-sub" ).bind( "click", function () {
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

			// ソートの昇順・降順切り替え
			( function () {
				var changeOrder = function ( text ) {
						return function () {
							var $this = $( this ),
								order = $this.data( "order" ) === "ASC" ? "DESC" : "ASC";

							$( this ).html( text[ order ] );
							$this.data( "order", order );
							CYPRESS.SORT_CONFIG.order = order;

							if ( !$( "#usage" ).length ) {
								CYPRESS.Manager.display();
							}
						};
					};

				$( "#lexicographic-sort-order-change" )
					.bind( "click", changeOrder( {
						ASC:  "<span class=\"icon\">&#xe603;</span> 辞書順　",
						DESC: "<span class=\"icon\">&#xe602;</span> 逆辞書順"
					} ) );

				$( "#numeric-sort-order-change" )
					.bind( "click", changeOrder( {
						ASC:  "<span class=\"icon\">&#xe601;</span> 低 → 高",
						DESC: "<span class=\"icon\">&#xe600;</span> 高 → 低"
					} ) );
			} () );
		} () );

		// Equipment Card Toolbox
		( function () {
			$.event.special.copy.options.hoverClass  = "data-copy-hover";
			$.event.special.copy.options.activeClass = "data-copy-active";

			$( "#equipments" ).on( {
				"click": function () {
					CYPRESS.Manager.forging( $( this ), 1 );
				}
			}, ".forging-plus" );

			$( "#equipments" ).on( {
				"click": function () {
					CYPRESS.Manager.forging( $( this ), -1 );
				}
			}, ".forging-minus" );

			$( "#equipments" ).on( {
				"copy": function ( e ) {
					e.clipboardData.clearData();
					e.clipboardData.setData( "text/plain", CYPRESS.getEquipmentString( CYPRESS.Manager.getCurrentEquipment( $( this ).parents( "[data-catalog]" ).data( "catalog" ) ).equipment ) );
					e.preventDefault();

					$( "#tool-commentary" ).text( "コピーしました (*ゝω･*)" );
				},
				"mouseenter": function () {
					var name = $( this ).parents( "[data-catalog]" ).find( ".name" ).text();

					$( "#tool-commentary" ).text( name + " のデータをコピー" );
					$( this ).parents( "[data-catalog]" ).find( ".toolbox" ).css( "visibility", "visible" );
				},
				"mouseleave": function () {
					$( "#tool-commentary" ).text( "" );
					$( this ).parents( "[data-catalog]" ).find( ".toolbox" ).css( "visibility", "" );
				}
			}, ".data-copy" );
		} () );
	} () );

	// initialize UIs
	$( "#reqiest-reset-button" ).click();
	$( "#usage-button" ).click();

	$( "#equipment-name" ).prop( "placeholder", "例：" + CYPRESS.Manager.getEquipmentName() );
} );
