using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using NPOI.XSSF.UserModel;
using NPOI.SS.UserModel;
using System.Diagnostics;

namespace Cypress {

	/// <summary>
	/// Wizardry Online Equipment JSON Builder. Microsoft Excel のワークシートを読み込んで JSON 形式のデータベースを出力する。
	/// </summary>
	public class JSONBuilder {
		/// <summary>
		/// 出力する装備用 JSON ファイル名
		/// </summary>
		public const string OUTPUT_EQUIPS_FILE = @"C:\Users\miku\Dropbox\Public\cypress\equipments.json";
		/// <summary>
		/// 出力するルビ用 JSON ファイル名
		/// </summary>
		public const string OUTPUT_RUBIES_FILE = @"C:\Users\miku\Dropbox\Public\cypress\rubies.json";
		/// <summary>
		/// 出力するバフ用 JSON ファイル名
		/// </summary>
		public const string OUTPUT_BUFFS_FILE = @"C:\Users\miku\Dropbox\Public\cypress\buffs.json";
		/// <summary>
		/// 生データが格納されているワークブックパス
		/// </summary>
		public const string INPUT_WORKBOOK_PATH = @"C:\Users\miku\SkyDrive\wizon\equipment.db.xlsm";
		/// <summary>
		/// 生データが格納されているシート名
		/// </summary>
		public const string EQUIPMENTS_WORKSHEET_NAME = "equips";
		/// <summary>
		/// 生データが格納されているシート名
		/// </summary>
		public const string BUFFS_WORKSHEET_NAME = "buffs";
		/// <summary>
		/// JSON の区切り文字定義
		/// </summary>
		public const string DELIMITER = ",";
		/// <summary>
		/// 現在取い扱いレコード
		/// </summary>
		public static IRow record;
		/// <summary>
		/// 品質コード対応表（整理番号生成時に利用）
		/// </summary>
		public static readonly Dictionary<string, int> RARITY_CODE = new Dictionary<string, int>() {
			{ "Poor",     1 },
			{ "Normal",   2 },
			{ "Good",     3 },
			{ "Master",   4 },
			{ "Epic",     5 },
			{ "Legend",   6 },
			{ "Artifact", 7 },
			{ "Other",    8 },
		};
		/// <summary>
		/// 種別コード対応表（整理番号生成時に利用） 
		/// </summary>
		public static readonly Dictionary<string, int> TYPE_CODE = new Dictionary<string, int>() {
			{ "暗器",      1 },
			{ "短剣",      2 },
			{ "片手剣",    3 },
			{ "両手剣",    4 },
			{ "刀",        5 },
			{ "片手斧",    6 },
			{ "両手斧",    7 },
			{ "槍",        8 },
			{ "片手鈍器" , 9 },
			{ "両手鈍器", 10 },
			{ "両手杖",   11 },
			{ "弓",       12 },
			{ "矢",       13 },
			{ "銃",       14 },
			{ "銃弾",     15 },
			{ "双刃",     16 },
			{ "兜",       21 },
			{ "帽子",     22 },
			{ "頭巾",     23 },
			{ "鎧",       26 },
			{ "上衣",     27 },
			{ "外衣",     28 },
			{ "脚鎧",     31 },
			{ "下衣",     32 },
			{ "手甲",     36 },
			{ "手袋",     37 },
			{ "腕輪",     38 },
			{ "鉄靴",     41 },
			{ "革靴",     42 },
			{ "靴",       43 },
			{ "小型盾",   46 },
			{ "中型盾",   47 },
			{ "大型盾",   48 },
			{ "外套",     51 },
			{ "指輪",     56 },
			{ "耳飾り",   57 },
			{ "首飾り",   58 },
			{ "ベルト",   59 },
		};

		/// <summary>
		/// 生データ（ワークシート）とのコラム対応表
		/// </summary>
		static class Column {
			//     const int CATALOG            =  0; // function
			public const int ORDER              =  1; // internal column
			public const int TYPE               =  2;
			public const int NAME               =  3;
			public const int RUBY               =  4;
			public const int RARITY             =  5;
			public const int GRADE              =  6;
			public const int PHYSICAL           =  7;
			public const int MAGIC              =  8;
			public const int RANGE              =  9;
			public const int QUALITY            = 10;
			public const int CHARGE_WEIGHT      = 11;
			public const int DURABILITY         = 12;
			public const int HARDNESS           = 13;
			public const int WEIGHT             = 14;
			public const int SLASH              = 15;
			public const int STRIKE             = 16;
			public const int PIERCE             = 17;
			//     const int CHECK              = 18; // function
			public const int ENCHANT            = 19;
			public const int FIG                = 20;
			public const int THI                = 21;
			public const int MAG                = 22;
			public const int PRI                = 23;
			public const int SAM                = 24;
			public const int NIN                = 25;
			public const int BIS                = 26;
			public const int LOR                = 27;
			public const int CLO                = 28;
			public const int ALC                = 29;
			//     const int CLASS              = 30; // function
			public const int HP                 = 31;
			public const int MP                 = 32;
			public const int STR                = 33;
			public const int VIT                = 34;
			public const int DEX                = 35;
			public const int AGI                = 36;
			public const int INT                = 37;
			public const int PIE                = 38;
			public const int LUK                = 39;
			public const int POISON             = 40;
			public const int PARALYZE           = 41;
			public const int PETRIFY            = 42;
			public const int FAINT              = 43;
			public const int BLIND              = 44;
			public const int SLEEP              = 45;
			public const int SILENCE            = 46;
			public const int CHARM              = 47;
			public const int CONFUSION          = 48;
			public const int FEAR               = 49;
			public const int FIRE_RESIST        = 50;
			public const int WATER_RESIST       = 51;
			public const int WIND_RESIST        = 52;
			public const int EARTH_RESIST       = 53;
			public const int LIGHT_RESIST       = 54;
			public const int DARK_RESIST        = 55;
			public const int FIRE_ATTACK        = 56;
			public const int WATER_ATTACK       = 57;
			public const int WIND_ATTACK        = 58;
			public const int EARTH_ATTACK       = 59;
			public const int LIGHT_ATTACK       = 60;
			public const int DARK_ATTACK        = 61;
			public const int SELL               = 62;
			public const int TRADE              = 63;
			public const int BIND               = 64;
			public const int STOLEN             = 65;
			public const int BLESSED            = 66;
			public const int CURSED             = 67;
			public const int LEVEL_FLOOR        = 68;
			public const int LEVEL_CEIL         = 69;
			public const int RESTRICTION        = 70;
			public const int WHEN_EQUIPPED      = 71;
			public const int WHEN_EQUIPPED_RUBY = 72;
			public const int WEPN               = 73;
			public const int STATUS_CHANGE      = 74;
			public const int STATUS_CHANGE_RUBY = 75;
			public const int PERCENT            = 76;
			public const int COMMENT            = 77;
			public const int SOURCE             = 78;
			public const int NOTES              = 79;
			public const int CHECKUP            = 80;
			public const int EVIDENCE           = 81;

			public const int BUFF   = 0;
			public const int EFFECT = 1;
		}

		/// <summary>
		/// 職業マスク（職業制限数値の算出に利用）
		/// </summary>
		static class ClassMask {
			public const int FIGHTER   =   1;
			public const int THIEF     =   2;
			public const int MAGE      =   4;
			public const int PRIEST    =   8;
			public const int SAMURAI   =  16;
			public const int NINJA     =  32;
			public const int BISHOP    =  64;
			public const int LORD      = 128;
			public const int CLOWN     = 256;
			public const int ALCHEMIST = 512;
		}


		static IWorkbook wb = null;

		static JSONBuilder() {
			using ( FileStream stream = File.OpenRead( INPUT_WORKBOOK_PATH ) ) {
				wb = new XSSFWorkbook( stream );
			}
		}

		/// <summary>
		/// Main メソッド
		/// </summary>
		/// <param name="args"></param>
		public static void Main( string[] args ) {
			Stopwatch sw = new Stopwatch();
			sw.Start();

			int records = BuildEquipmentsJson();
			BuildBuffJson();

			sw.Stop();
			Console.WriteLine( "successed. {0} records ({1:#,0}ms)", records, sw.ElapsedMilliseconds );

			Console.Write( "\nPlease any key to close..." );
			Console.ReadKey();
		}

		private static int BuildEquipmentsJson() {
			int records = 0;

			// input
			ISheet sheet = wb.GetSheet( EQUIPMENTS_WORKSHEET_NAME );

			// build json
			StringBuilder equips = new StringBuilder( "" );
			StringBuilder rubies = new StringBuilder( "" );
			int numberOfRecords = sheet.LastRowNum;

			// header
			equips.Append( "{\n\"equipments\": {\n" );
			rubies.Append( "{\n\"rubies\": {\n" );

			// body
			for ( int i = 1; i <= numberOfRecords; i++ ) {
				record = sheet.GetRow( i );
				records++;

				// デバッグ用
				//Console.WriteLine( record.GetCell( Column.NAME ).StringCellValue );

				int catalog = GetCatalog();

				equips
					.Append( "\"" + catalog + "\":[" )
					// basic information
					.ProcessedIntegerData( TYPE_CODE.GetListId( Column.TYPE ) )
					.StringData( Column.NAME )
					.ProcessedIntegerData( RARITY_CODE.GetListId( Column.RARITY ) )
					.IntegerData( Column.GRADE )
					// capabilities
					.IntegerData( Column.PHYSICAL )
					.IntegerData( Column.MAGIC )
					.IntegerData( Column.RANGE )
					.IntegerData( Column.QUALITY )
					.IntegerData( Column.CHARGE_WEIGHT )
					.IntegerData( Column.DURABILITY )
					.IntegerData( Column.HARDNESS )
					.RealData( Column.WEIGHT )
					.IntegerData( Column.SLASH )
					.IntegerData( Column.STRIKE )
					.IntegerData( Column.PIERCE )
					.IntegerData( Column.ENCHANT )
					// class restriction
					.ProcessedIntegerData( GetClassRestriction() )
					// special effects
					.IntegerData( Column.HP )
					.IntegerData( Column.MP )
					.IntegerData( Column.STR )
					.IntegerData( Column.VIT )
					.IntegerData( Column.DEX )
					.IntegerData( Column.AGI )
					.IntegerData( Column.INT )
					.IntegerData( Column.PIE )
					.IntegerData( Column.LUK )
					// resistance
					.IntegerData( Column.POISON )
					.IntegerData( Column.PARALYZE )
					.IntegerData( Column.PETRIFY )
					.IntegerData( Column.FAINT )
					.IntegerData( Column.BLIND )
					.IntegerData( Column.SLEEP )
					.IntegerData( Column.SILENCE )
					.IntegerData( Column.CHARM )
					.IntegerData( Column.CONFUSION )
					.IntegerData( Column.FEAR )
					// magic attributes (resist)
					.IntegerData( Column.FIRE_RESIST )
					.IntegerData( Column.WATER_RESIST )
					.IntegerData( Column.WIND_RESIST )
					.IntegerData( Column.EARTH_RESIST )
					.IntegerData( Column.LIGHT_RESIST )
					.IntegerData( Column.DARK_RESIST )
					// magic attributes (attack)
					.IntegerData( Column.FIRE_ATTACK )
					.IntegerData( Column.WATER_ATTACK )
					.IntegerData( Column.WIND_ATTACK )
					.IntegerData( Column.EARTH_ATTACK )
					.IntegerData( Column.LIGHT_ATTACK )
					.IntegerData( Column.DARK_ATTACK )
					// flags
					.BooleanData( Column.SELL )
					.BooleanData( Column.TRADE )
					.BooleanData( Column.BIND )
					.BooleanData( Column.STOLEN )
					.BooleanData( Column.BLESSED )
					.BooleanData( Column.CURSED )
					// level restriction
					.IntegerData( Column.LEVEL_FLOOR )
					.IntegerData( Column.LEVEL_CEIL )
					// other restrictions
					.StringData( Column.RESTRICTION )
					// when equipped
					.StringData( Column.WHEN_EQUIPPED )
					.BooleanData( Column.WEPN )
					// status change
					.StringData( Column.STATUS_CHANGE )
					.IntegerData( Column.PERCENT )
					// note
					.StringData( Column.COMMENT )
					.StringData( Column.SOURCE )
					.StringData( Column.NOTES )
					// checkup
					.StringData( Column.CHECKUP )
					.StringData( Column.EVIDENCE );

				equips.Remove( equips.Length - 1, 1 );
				equips.Append( "],\n" );

				rubies
					.Append( "\"" + catalog + "\":[" )
					.StringData( Column.RUBY )
					.StringData( Column.WHEN_EQUIPPED_RUBY )
					.StringData( Column.STATUS_CHANGE_RUBY );

				rubies.Remove( rubies.Length - 1, 1 );
				rubies.Append( "],\n" );

			}

			// footer
			equips.Remove( equips.Length - 2, 2 )
				  .Append( "\n}\n}\n" );
			rubies.Remove( rubies.Length - 2, 2 )
				  .Append( "\n}\n}\n" );

			// output
			using ( StreamWriter writer = new StreamWriter( OUTPUT_EQUIPS_FILE, false, Encoding.GetEncoding( "UTF-8" ) ) ) {
				writer.Write( equips.ToString() );
			}
			using ( StreamWriter writer = new StreamWriter( OUTPUT_RUBIES_FILE, false, Encoding.GetEncoding( "UTF-8" ) ) ) {
				writer.Write( rubies.ToString() );
			}

			return records;
		}

		private static void BuildBuffJson() {
			// build json
			StringBuilder buffs = new StringBuilder( "" );
			ISheet sheet = wb.GetSheet( BUFFS_WORKSHEET_NAME );
			int numberOfRecords = sheet.LastRowNum;

			// header
			buffs.Append( "{\n" );

			// body
			for ( int i = 1; i <= numberOfRecords; i++ ) {
				ICell cell;

				record = sheet.GetRow( i );

				cell = record.GetCell( Column.BUFF );
				buffs.Append( "\"" + cell.StringCellValue + "\":" );

				cell = record.GetCell( Column.EFFECT );
				buffs.Append( "\"" + ( cell != null ? cell.StringCellValue : "" ) + "\",\n" );
			}

			// footer
			buffs.Remove( buffs.Length - 2, 2 )
				  .Append( "\n}\n" );

			// output
			using ( StreamWriter writer = new StreamWriter( OUTPUT_BUFFS_FILE, false, Encoding.GetEncoding( "UTF-8" ) ) ) {
				writer.Write( buffs.ToString() );
			}
		}

		/// <summary>
		/// レコードの整理番号を取得する
		/// </summary>
		/// <returns>レコードの整理番号</returns>
		private static int GetCatalog() {
			const int TYPE_COEFFICIENT   = 100000;
			const int GRADE_COEFFICIENT  =   1000;
			const int RARITY_COEFFICIENT =    100;

			int type   = TYPE_CODE.GetListId( Column.TYPE );
			int grade  = ( int )record.GetCell( Column.GRADE ).NumericCellValue;
			int rarity = RARITY_CODE.GetListId( Column.RARITY );
			int order  = ( int )record.GetCell( Column.ORDER ).NumericCellValue;

			return type * TYPE_COEFFICIENT + grade * GRADE_COEFFICIENT + rarity * RARITY_COEFFICIENT + order;
		}

		/// <summary>
		/// 装備の職業制限数値を取得する
		/// </summary>
		/// <returns>職業制限数値</returns>
		private static int GetClassRestriction() {
			return ( int )( record.GetCell( Column.FIG ).NumericCellValue * ClassMask.FIGHTER +
							record.GetCell( Column.THI ).NumericCellValue * ClassMask.THIEF +
							record.GetCell( Column.MAG ).NumericCellValue * ClassMask.MAGE +
							record.GetCell( Column.PRI ).NumericCellValue * ClassMask.PRIEST +
							record.GetCell( Column.SAM ).NumericCellValue * ClassMask.SAMURAI +
							record.GetCell( Column.BIS ).NumericCellValue * ClassMask.BISHOP +
							record.GetCell( Column.NIN ).NumericCellValue * ClassMask.NINJA +
							record.GetCell( Column.LOR ).NumericCellValue * ClassMask.LORD +
							record.GetCell( Column.CLO ).NumericCellValue * ClassMask.CLOWN +
							record.GetCell( Column.ALC ).NumericCellValue * ClassMask.ALCHEMIST );
		}
	}

	public static class Extentions {
		/// <summary>
		/// 真偽値データ（項目）を構築する
		/// </summary>
		/// <param name="equips">編集中の JSON 文字列</param>
		/// <param name="column">生データのコラム番号</param>
		/// <returns>加工した自分自身</returns>
		public static StringBuilder BooleanData( this StringBuilder equips, int column ) {
			return equips.Append( JSONBuilder.record.GetCell( column ).BooleanCellValue ? 1 : 0 ).Append( JSONBuilder.DELIMITER );
		}

		/// <summary>
		/// 整数データ（項目）を構築する
		/// </summary>
		/// <param name="equips">編集中の JSON 文字列</param>
		/// <param name="column">生データのコラム番号</param>
		/// <returns>加工した自分自身</returns>
		public static StringBuilder IntegerData( this StringBuilder equips, int column ) {
			return equips.Append( ( int )JSONBuilder.record.GetCell( column ).NumericCellValue ).Append( JSONBuilder.DELIMITER );
		}

		/// <summary>
		/// 加工付き整数データ（項目）を構築する
		/// </summary>
		/// <param name="equips">編集中の JSON 文字列</param>
		/// <param name="data">加工済データ</param>
		/// <returns>加工した自分自身</returns>
		public static StringBuilder ProcessedIntegerData( this StringBuilder equips, int data ) {
			return equips.Append( data ).Append( JSONBuilder.DELIMITER );
		}

		/// <summary>
		/// 実数データ（項目）を構築する
		/// </summary>
		/// <param name="equips">編集中の JSON 文字列</param>
		/// <param name="column">生データのコラム番号</param>
		/// <returns>加工した自分自身</returns>
		public static StringBuilder RealData( this StringBuilder equips, int column ) {
			return equips.Append( JSONBuilder.record.GetCell( column ).NumericCellValue ).Append( JSONBuilder.DELIMITER );
		}

		/// <summary>
		/// 文字列データ（項目）を構築する
		/// </summary>
		/// <param name="equips">編集中の JSON 文字列</param>
		/// <param name="column">生データのコラム番号</param>
		/// <returns>加工した自分自身</returns>
		public static StringBuilder StringData( this StringBuilder equips, int column ) {
			ICell cell = JSONBuilder.record.GetCell( column );

			return equips.Append( "\"" ).Append( cell != null ? cell.StringCellValue : "" ).Append( "\"" ).Append( JSONBuilder.DELIMITER );
		}

		/// <summary>
		/// リスト項目の ID を取得する
		/// </summary>
		/// <param name="list">リスト</param>
		/// <param name="column">生データのコラム番号</param>
		/// <returns>リストID</returns>
		public static int GetListId( this Dictionary<string, int> list, int column ) {
			return list[ JSONBuilder.record.GetCell( column ).StringCellValue ];
		}
	}
}
