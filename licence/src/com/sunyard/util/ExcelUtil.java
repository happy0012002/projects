package com.sunyard.util;

import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.ss.usermodel.CellValue;
import org.apache.poi.ss.usermodel.FormulaEvaluator;

public class ExcelUtil {

	
	/**
	 * @param j �� 
	 * @param i ��
	 * @return
	 */
	public static String getContent(HSSFSheet sheet, int rowNum, int col) {
		Object content = null;
		// ����ж���
		HSSFRow row = sheet.getRow(rowNum);
		if(null==row){
			return "";
		}
		HSSFCell cell = row.getCell(col);
		if (null != cell) {
			FormulaEvaluator evaluator = sheet.getWorkbook().getCreationHelper().createFormulaEvaluator();
			evaluator.evaluateFormulaCell(cell);
			CellValue cellValue = evaluator.evaluate(cell);
			if(null != cellValue){
				switch (cellValue.getCellType()) {
					case HSSFCell.CELL_TYPE_STRING:
						content = cellValue.getStringValue();
						break;
					case HSSFCell.CELL_TYPE_NUMERIC:
						content = (int) cellValue.getNumberValue();//�������С����
						break;
					case HSSFCell.CELL_TYPE_ERROR:
						content = cellValue.getErrorValue();
						break;
					case HSSFCell.CELL_TYPE_BOOLEAN:
						content = cellValue.getBooleanValue();
						break;
					case HSSFCell.CELL_TYPE_FORMULA:
						content = null;
						break;
					case HSSFCell.CELL_TYPE_BLANK:
						content = null;
						break;
					}
			}else{
				content = "";
			}
		} else {
			content = "";
		}
		return content == null ? "" : String.valueOf(content).trim();
	}
}
