import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import { createReport } from '../services/reports';

function reportError(res: Response, error: unknown) {
  const status = Number((error as { status?: number })?.status) || 500;
  if (status === 500) console.error('Failed to create report:', error);
  return res.status(status).json({ message: status === 500 ? 'Không thể tạo báo cáo' : (error as Error).message });
}

export async function getReport(req: Request, res: Response): Promise<void> {
  try { res.json(await createReport(req.params.type, req.query.period)); }
  catch (error) { reportError(res, error); }
}

export async function downloadReportExcel(req: Request, res: Response): Promise<void> {
  try {
    const report = await createReport(req.params.type, req.query.period);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Quản lý nhà trọ';
    const overview = workbook.addWorksheet('Tổng quan');
    overview.addRow([report.title]); overview.addRow([report.period ? `Kỳ: ${String(report.period.month).padStart(2, '0')}/${report.period.year}` : `Chốt lúc: ${report.generatedAt}`]);
    overview.addRow(['Tạo lúc', report.generatedAt]); overview.addRow([]); overview.addRow(['Chỉ tiêu', 'Giá trị']);
    for (const item of report.summary) {
      const row = overview.addRow([item.label, item.value]);
      if (item.format === 'currency') row.getCell(2).numFmt = '#,##0;[Red]-#,##0';
      if (item.format === 'number') row.getCell(2).numFmt = '#,##0';
    }
    if (report.note) overview.addRow(['Ghi chú', report.note]);
    overview.getRow(1).font = { bold: true, size: 16, color: { argb: 'FF0D2137' } };
    overview.getRow(5).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    overview.getRow(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D2137' } };
    overview.getColumn(1).width = 34; overview.getColumn(2).width = 32;

    const details = workbook.addWorksheet('Chi tiết');
    details.addRow(report.columns.map(c => c.label));
    for (const item of report.rows) details.addRow(report.columns.map(c => item[c.key] ?? ''));
    details.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    details.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D2137' } };
    details.views = [{ state: 'frozen', ySplit: 1 }];
    details.columns = report.columns.map(c => ({ key: c.key, width: Math.max(14, Math.min(32, c.label.length + 6)), style: c.format === 'currency' ? { numFmt: '#,##0;[Red]-#,##0' } : {} }));
    const buffer = await workbook.xlsx.writeBuffer();
    const suffix = report.period ? `-${report.period.year}-${String(report.period.month).padStart(2, '0')}` : `-${new Date().toISOString().slice(0, 10)}`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${report.type}${suffix}.xlsx"`);
    res.send(Buffer.from(buffer));
  } catch (error) { reportError(res, error); }
}
