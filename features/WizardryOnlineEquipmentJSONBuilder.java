package cypress;

import java.io.*;
import java.util.HashMap;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;

/**
 * Wizardry Online Equipment JSON Builder.
 * Microsoft Excel のワークシートを読み込んで JSON 形式のデータベースを出力する。
 * @author miku
 */
public class WizardryOnlineEquipmentJSONBuilder {
	/** 出力する JSON ファイル名 */
	public static final File OUTPUT_JSON_FILE = new File( "C:\\Users\\miku\\Dropbox\\Public\\wizon\\equipment.json" );
	/** 生データが格納されているワークブックパス */
	public static final String INPUT_WORKBOOK_PATH = "C:\\Users\\miku\\SkyDrive\\wizon\\equipment.db.xlsm";
	/** 生データが格納されているシート名 */
	public static final String DETABASE_WORKSHEET_NAME = "master";
	/** JSON の区切り文字定義 */
	public static final String DELIMITER = ",";

	/** 現在取り扱いレコード */
	private static Row record;
	/** 出力する JSON （文字列） */
	private static StringBuilder json = new StringBuilder( "" );

	/**
	 * 品質コード対応表（整理番号生成時に利用）
	 * 内容は static 初期化子で構築
	 */
	public static final HashMap< String, Integer > RARITY_CODE = new HashMap<>();
	/**
	 * 種別コード対応表（整理番号生成時に利用）
	 * 内容は static 初期化子で構築
	 */
	public static final HashMap< String, Integer > TYPE_CODE = new HashMap<>();

	/** 生データ（ワークシート）とのコラム対応表 */
	interface Column {
//		int CATALOG = 0;	// function
		int ORDER = 1;	// internal column
		int TYPE = 2;
		int NAME = 3;
		int RARITY = 4;
		int GRADE = 5;
		int PHYSICAL = 6;
		int MAGIC = 7;
		int RANGE = 8;
		int QUALITY = 9;
		int CHARGE_WEIGHT = 10;
		int DURABILITY = 11;
		int WEIGHT = 12;
		int HARDNESS = 13;
		int SLASH = 14;
		int STRIKE = 15;
		int PIERCE = 16;
//		int CHECK = 17;	 // function
		int FIG = 18;
		int THI = 19;
		int MAG = 20;
		int PRI = 21;
		int SAM = 22;
		int NIN = 23;
		int BIS = 24;
		int LOR = 25;
		int CLO = 26;
		int ALC = 27;
//		int CLASS = 28;	 // function
		int HP = 29;
		int MP = 30;
		int STR = 31;
		int VIT = 32;
		int DEX = 33;
		int AGI = 34;
		int INT = 35;
		int PIE = 36;
		int LUK = 37;
		int POISON = 38;
		int PARALYZE = 39;
		int PETRIFY = 40;
		int FAINT = 41;
		int BLIND = 42;
		int SLEEP = 43;
		int SILENCE = 44;
		int CHARM = 45;
		int CONFUSION = 46;
		int FEAR = 47;
		int FIRE_RESIST = 48;
		int WATER_RESIST = 49;
		int WIND_RESIST = 50;
		int EARTH_RESIST = 51;
		int LIGHT_RESIST = 52;
		int DARK_RESIST = 53;
		int FIRE_ATTACK = 54;
		int WATER_ATTACK = 55;
		int WIND_ATTACK = 56;
		int EARTH_ATTACK = 57;
		int LIGHT_ATTACK = 58;
		int DARK_ATTACK = 59;
		int SELL = 60;
		int TRADE = 61;
		int USED = 62;
		int STOLEN = 63;
		int BLESSED = 64;
		int CURSED = 65;
		int LEVEL_FLOOR = 66;
		int LEVEL_CEIL = 67;
		int RESTRICTION = 68;
		int WHEN_EQUIPPED = 69;
		int WEPN = 70;
		int STATUS_CHANGE = 71;
		int PERCENT = 72;
		int COMMENT = 73;
		int SOURCE = 74;
		int NOTES = 75;
		int CHECKUP = 76;
		int EVIDENCE = 77;
	}

	/** 職業マスク（職業制限数値の算出に利用） */
	interface ClassMask {
		int FIGHTER = 1;
		int THIEF = 2;
		int MAGE = 4;
		int PRIEST = 8;
		int SAMURAI = 16;
		int NINJA = 32;
		int BISHOP = 64;
		int LORD = 128;
		int CLOWN = 256;
		int ALCHEMIST = 512;
	}

	/** 品質コード参照表と種別コード 対応表の構築 */
	static {
		// define rarity code
		RARITY_CODE.put( "Poor", 1 );
		RARITY_CODE.put( "Normal", 2 );
		RARITY_CODE.put( "Good", 3 );
		RARITY_CODE.put( "Master", 4 );
		RARITY_CODE.put( "Legend", 5 );
		RARITY_CODE.put( "Artifact", 6 );

		// define type code
		TYPE_CODE.put( "暗器", 1 );
		TYPE_CODE.put( "短剣", 2 );
		TYPE_CODE.put( "片手剣", 3 );
		TYPE_CODE.put( "両手剣", 4 );
		TYPE_CODE.put( "刀", 5 );
		TYPE_CODE.put( "片手斧", 6 );
		TYPE_CODE.put( "両手斧", 7 );
		TYPE_CODE.put( "槍", 8 );
		TYPE_CODE.put( "片手鈍器", 9 );
		TYPE_CODE.put( "両手鈍器",10 );
		TYPE_CODE.put( "両手杖", 11 );
		TYPE_CODE.put( "弓", 12 );
		TYPE_CODE.put( "矢", 13 );
		TYPE_CODE.put( "銃", 14 );
		TYPE_CODE.put( "銃弾", 15 );
		TYPE_CODE.put( "双刃", 16 );
		TYPE_CODE.put( "兜", 21 );
		TYPE_CODE.put( "帽子", 22 );
		TYPE_CODE.put( "頭巾", 23 );
		TYPE_CODE.put( "鎧", 26 );
		TYPE_CODE.put( "上衣", 27 );
		TYPE_CODE.put( "外衣", 28 );
		TYPE_CODE.put( "手甲", 31 );
		TYPE_CODE.put( "手袋", 32 );
		TYPE_CODE.put( "腕輪", 33 );
		TYPE_CODE.put( "脚鎧", 36 );
		TYPE_CODE.put( "衣服", 37 );
		TYPE_CODE.put( "下衣", 38 );
		TYPE_CODE.put( "鉄靴", 41 );
		TYPE_CODE.put( "革靴", 42 );
		TYPE_CODE.put( "靴", 43 );
		TYPE_CODE.put( "小型盾", 46 );
		TYPE_CODE.put( "中型盾", 47 );
		TYPE_CODE.put( "大型盾", 48 );
		TYPE_CODE.put( "外套", 51 );
		TYPE_CODE.put( "指輪", 56 );
		TYPE_CODE.put( "耳飾り", 57 );
		TYPE_CODE.put( "首飾り", 58 );
		TYPE_CODE.put( "ベルト", 59 );
	}

	/**
	 * main メソッド
	 * @param args 使用しない
	 */
	public static void main( String[] args ) {
		// input
		Workbook wb = null;

		try {
			wb = WorkbookFactory.create( new FileInputStream( INPUT_WORKBOOK_PATH ) );
		} catch ( IOException | InvalidFormatException e ) {
		}

		Sheet sheet = wb.getSheet( DETABASE_WORKSHEET_NAME );

		// build json
		// header
		json.append( "{\n\"equipment\": {\n" );

		int numberOfRecords = sheet.getLastRowNum();

		// 第0行はタイトルにつき第1行から走査する
		for ( int i = 1; i <= numberOfRecords; i++ ) {
			record = sheet.getRow( i );

			json.append( "\"" ).append( getCatalog() ).append( "\":[" );

			// デバッグ用
//			System.out.println( record.getCell( Column.NAME ).getStringCellValue() );

			// basic information
			buildProcessedIntegerData( getListId( TYPE_CODE, Column.TYPE ) );
			buildStringData( Column.NAME );
			buildProcessedIntegerData( getListId( RARITY_CODE, Column.RARITY ) );
			buildIntegerData( Column.GRADE );

			// capabilities
			buildIntegerData( Column.PHYSICAL );
			buildIntegerData( Column.MAGIC );
			buildIntegerData( Column.RANGE );
			buildIntegerData( Column.QUALITY );
			buildIntegerData( Column.CHARGE_WEIGHT );
			buildIntegerData( Column.DURABILITY );
			buildRealData( Column.WEIGHT );
			buildIntegerData( Column.HARDNESS );
			buildIntegerData( Column.SLASH );
			buildIntegerData( Column.STRIKE );
			buildIntegerData( Column.PIERCE );

			// class restriction
			buildProcessedIntegerData( getClassRestriction() );

			// special effects
			buildIntegerData( Column.HP );
			buildIntegerData( Column.MP );
			buildIntegerData( Column.STR );
			buildIntegerData( Column.VIT );
			buildIntegerData( Column.DEX );
			buildIntegerData( Column.AGI );
			buildIntegerData( Column.INT );
			buildIntegerData( Column.PIE );
			buildIntegerData( Column.LUK );

			// resistance
			buildIntegerData( Column.POISON );
			buildIntegerData( Column.PARALYZE );
			buildIntegerData( Column.PETRIFY );
			buildIntegerData( Column.FAINT );
			buildIntegerData( Column.BLIND );
			buildIntegerData( Column.SLEEP );
			buildIntegerData( Column.SILENCE );
			buildIntegerData( Column.CHARM );
			buildIntegerData( Column.CONFUSION );
			buildIntegerData( Column.FEAR );

			// magic attributes (resist)
			buildIntegerData( Column.FIRE_RESIST );
			buildIntegerData( Column.WATER_RESIST );
			buildIntegerData( Column.WIND_RESIST );
			buildIntegerData( Column.EARTH_RESIST );
			buildIntegerData( Column.LIGHT_RESIST );
			buildIntegerData( Column.DARK_RESIST );

			// magic attributes (attack)
			buildIntegerData( Column.FIRE_ATTACK );
			buildIntegerData( Column.WATER_ATTACK );
			buildIntegerData( Column.WIND_ATTACK );
			buildIntegerData( Column.EARTH_ATTACK );
			buildIntegerData( Column.LIGHT_ATTACK );
			buildIntegerData( Column.DARK_ATTACK );

			// flags
			buildBooleanData( Column.SELL );
			buildBooleanData( Column.TRADE );
			buildBooleanData( Column.USED );
			buildBooleanData( Column.STOLEN );
			buildBooleanData( Column.BLESSED );
			buildBooleanData( Column.CURSED );

			// revel restriction
			buildIntegerData( Column.LEVEL_FLOOR );
			buildIntegerData( Column.LEVEL_CEIL );

			// other restrictions
			buildStringData( Column.RESTRICTION );

			// when equipped
			buildStringData( Column.WHEN_EQUIPPED );
			buildBooleanData( Column.WEPN );

			// status change
			buildStringData( Column.STATUS_CHANGE );
			buildIntegerData( Column.PERCENT );

			// note
			buildStringData( Column.COMMENT );
			buildStringData( Column.SOURCE );
			buildStringData( Column.NOTES );

			// checkup
			buildStringData( Column.CHECKUP );
			buildBooleanData( Column.EVIDENCE );

			json.deleteCharAt( json.length() - 1 );

			json.append( "]," );
			json.append( "\n" );
		}

		// footer
		json.deleteCharAt( json.length() - 1 );
		json.deleteCharAt( json.length() - 1 );

		json.append( "\n}\n}\n" );

		// output
		try ( Writer writer = new FileWriter( OUTPUT_JSON_FILE ) ) {
			writer.write( json.toString() );
		} catch ( IOException e ) {
		}
		System.out.println( "successed (" + numberOfRecords + " records)" );
	}

	/**
	 * 真偽値データ（項目）を構築する
	 * @param column 生データのコラム番号
	 */
	private static void buildBooleanData( int column ) {
		json.append( record.getCell( column ).getBooleanCellValue() ? 1 : 0 ).append( DELIMITER );
	}

	/**
	 * 整数データ（項目）を構築する
	 * @param column 生データのコラム番号
	 */
	private static void buildIntegerData( int column ) {
		Cell cell = record.getCell( column );

		if ( cell.getCellType() == Cell.CELL_TYPE_NUMERIC ) {
			json.append( ( int )cell.getNumericCellValue() ).append( DELIMITER );
		} else {
			json.append( "null" ).append( DELIMITER );
		}
	}

	/**
	 * 加工付き整数データ（項目）を構築する
	 * @param int 加工済データ
	 */
	private static void buildProcessedIntegerData( int data ) {
		json.append( data ).append( DELIMITER );
	}

	/**
	 * 実数データ（項目）を構築する
	 * @param column 生データのコラム番号
	 */
	private static void buildRealData( int column ) {
		Cell cell = record.getCell( column );

		if ( cell.getCellType() == Cell.CELL_TYPE_NUMERIC ) {
			json.append( cell.getNumericCellValue() ).append( DELIMITER );
		} else {
			json.append( "null" ).append( DELIMITER );
		}
	}

	/**
	 * 文字列データ（項目）を構築する
	 * @param column 生データのコラム番号
	 */
	private static void buildStringData( int column ) {
		Cell cell = record.getCell( column );

		json.append( "\"" ).append( cell != null ? cell.getStringCellValue() : "" ).append( "\"" ).append( DELIMITER );
	}

	/**
	 * リスト項目の ID を取得する
	 * @param list リスト
	 * @param column 生データのコラム番号
	 * @return リストID
	 */
	private static int getListId( HashMap< String, Integer > list, int column ) {
		return list.get( record.getCell( column ).getStringCellValue() );
	}

	/**
	 * レコードの整理番号を取得する
	 * @return レコードの整理番号
	 */
	private static int getCatalog() {
		final int typeCoefficient = 100000;
		final int soulRankCoefficient = 1000;
		final int rarityCoefficient = 100;

		return ( int )( TYPE_CODE.get( record.getCell( Column.TYPE ).getStringCellValue() ) * typeCoefficient
						+ record.getCell( Column.GRADE ).getNumericCellValue() * soulRankCoefficient
						+ RARITY_CODE.get( record.getCell( Column.RARITY ).getStringCellValue() ) * rarityCoefficient
						+ record.getCell( Column.ORDER ).getNumericCellValue() );
	}

	/**
	 * 装備の職業制限数値を取得する
	 * @return 職業制限数値
	 */
	private static int getClassRestriction() {
		return ( int )( record.getCell( Column.FIG ).getNumericCellValue() * ClassMask.FIGHTER
						+ record.getCell( Column.THI ).getNumericCellValue() * ClassMask.THIEF
						+ record.getCell( Column.MAG ).getNumericCellValue() * ClassMask.MAGE
						+ record.getCell( Column.PRI ).getNumericCellValue() * ClassMask.PRIEST
						+ record.getCell( Column.SAM ).getNumericCellValue() * ClassMask.SAMURAI
						+ record.getCell( Column.BIS ).getNumericCellValue() * ClassMask.BISHOP
						+ record.getCell( Column.NIN ).getNumericCellValue() * ClassMask.NINJA
						+ record.getCell( Column.LOR ).getNumericCellValue() * ClassMask.LORD
						+ record.getCell( Column.CLO ).getNumericCellValue() * ClassMask.CLOWN
						+ record.getCell( Column.ALC ).getNumericCellValue() * ClassMask.ALCHEMIST );
	}
}
