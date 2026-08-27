import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const root = "C:/workspace/project/anhuan-safety-platform/platform-v2/docs/prd";
const outputDir = "C:/workspace/project/anhuan-safety-platform/platform-v2/docs/prd/outputs/20260805-prd-confirmation";
const sourcePath = path.join(root, "安全管理平台PRD业务确认清单_20260805.md");
const md = await fs.readFile(sourcePath, "utf8");

function cleanCell(value) {
  return value.trim();
}

function parseTable(lines, startIndex) {
  const rows = [];
  let i = startIndex;
  while (i < lines.length && !lines[i].trim().startsWith("|")) i += 1;
  if (i >= lines.length) return { rows, next: i };
  const header = lines[i].split("|").slice(1, -1).map((v) => v.trim());
  i += 1;
  if (i < lines.length && /^\s*\|?\s*:?-+/.test(lines[i])) i += 1;
  while (i < lines.length && lines[i].trim().startsWith("|")) {
    const cells = lines[i].split("|").slice(1, -1).map(cleanCell);
    if (cells.length) rows.push(Object.fromEntries(header.map((h, idx) => [h, cells[idx] ?? ""])));
    i += 1;
  }
  return { rows, next: i };
}

const lines = md.split(/\r?\n/);
const confirmRows = [];
let moduleName = "";
let inRequirements = false;
for (let i = 0; i < lines.length; i += 1) {
  const line = lines[i];
  if (line.startsWith("## 3.")) inRequirements = true;
  if (line.startsWith("## 4.")) inRequirements = false;
  if (line.startsWith("### ")) moduleName = line.slice(4).trim();
  if (inRequirements && line.startsWith("| 编号 |")) {
    const parsed = parseTable(lines, i);
    for (const row of parsed.rows) confirmRows.push({ ...row, 模块: moduleName });
    i = parsed.next - 1;
  }
}

const confirmed = [];
let inConfirmed = false;
for (const line of lines) {
  if (line.startsWith("## 2.")) inConfirmed = true;
  else if (line.startsWith("## 3.")) inConfirmed = false;
  else if (inConfirmed && /^\d+\.\s+/.test(line)) {
    const match = line.match(/^(\d+)\.\s+(.*)$/);
    confirmed.push([`A${match[1].padStart(2, "0")}`, match[2]]);
  }
}

const deferred = [];
let inDeferred = false;
for (const line of lines) {
  if (line.startsWith("## 4.")) inDeferred = true;
  else if (line.startsWith("## 5.")) inDeferred = false;
  else if (inDeferred && /^\d+\.\s+/.test(line)) {
    const match = line.match(/^(\d+)\.\s+(.*)$/);
    deferred.push([`D${match[1].padStart(2, "0")}`, match[2]]);
  }
}

const conflicts = [];
let inConflicts = false;
for (let i = 0; i < lines.length; i += 1) {
  if (lines[i].startsWith("## 5.")) inConflicts = true;
  else if (lines[i].startsWith("## 6.")) inConflicts = false;
  if (inConflicts && lines[i].startsWith("| 编号 |")) {
    const parsed = parseTable(lines, i);
    conflicts.push(...parsed.rows);
    i = parsed.next - 1;
  }
}

const wb = Workbook.create();
const navy = "#153E75";
const blue = "#DCEAF7";
const pale = "#F5F8FC";
const border = "#C7D2E3";
const orange = "#FFF2CC";
const green = "#E2F0D9";
const red = "#FCE4D6";

function title(sheet, range, text) {
  sheet.getRange(range).merge();
  const r = sheet.getRange(range);
  r.values = [[text]];
  r.format = { fill: navy, font: { bold: true, color: "#FFFFFF", size: 15 }, horizontalAlignment: "center", verticalAlignment: "center" };
  r.format.rowHeight = 30;
}

function section(sheet, range, text, fill = blue) {
  sheet.getRange(range).merge();
  const r = sheet.getRange(range);
  r.values = [[text]];
  r.format = { fill, font: { bold: true, color: "#1F2937" }, verticalAlignment: "center" };
  r.format.rowHeight = 24;
}

function headerStyle(range) {
  range.format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center", verticalAlignment: "center", wrapText: true, borders: { preset: "all", style: "thin", color: border } };
  range.format.rowHeight = 36;
}

function bodyStyle(range) {
  range.format = { fill: "#FFFFFF", font: { color: "#1F2937", size: 10 }, verticalAlignment: "top", wrapText: true, borders: { preset: "inside", style: "thin", color: border } };
}

// 使用说明
const info = wb.worksheets.add("使用说明");
info.showGridLines = false;
title(info, "A1:H1", "安全管理平台 PRD 业务确认清单");
info.getRange("A2:H2").merge();
info.getRange("A2").values = [["版本：V1.0  |  日期：2026-08-05  |  用途：业务方确认后冻结PRD、权限、流程、统计口径和验收标准"]];
info.getRange("A2:H2").format = { fill: pale, font: { italic: true, color: "#475569" }, horizontalAlignment: "center" };
section(info, "A4:H4", "填写说明");
info.getRange("A5:H9").values = [
  ["1", "本表只保留需要业务决策的事项；接口重试、事务、缓存等技术实现不要求业务方确认。", "", "", "", "", "", ""],
  ["2", "请在“业务结论、确认人、确认日期、是否影响周期/费用、备注”列填写最终意见。", "", "", "", "", "", ""],
  ["3", "优先确认 B-01～B-22，再确认 B-23～B-30；确认后再统一回填各份PRD。", "", "", "", "", "", ""],
  ["4", "已确认口径、文档冲突和可后置事项分别放在独立工作表，便于留痕。", "", "", "", "", "", ""],
  ["5", "建议每条结论同时记录依据制度/附件及是否引起周期、费用或验收范围变化。", "", "", "", "", "", ""],
];
info.getRange("A5:A9").format = { fill: blue, font: { bold: true }, horizontalAlignment: "center", verticalAlignment: "top" };
info.getRange("B5:H9").merge(true);
info.getRange("B5:H9").format = { wrapText: true, verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
info.getRange("A5:H9").format.rowHeight = 30;
section(info, "A11:H11", "当前确认进度（初始状态，填写后请同步更新）", green);
info.getRange("A12:B16").values = [
  ["指标", "数量"],
  ["待确认事项总数", null],
  ["已填写业务结论", null],
  ["未确认事项", null],
  ["文档冲突待处理", conflicts.length],
];
info.getRange("B13:B15").values = [[confirmRows.length], [0], [confirmRows.length]];
info.getRange("A12:B12").format = { fill: navy, font: { bold: true, color: "#FFFFFF" }, horizontalAlignment: "center" };
info.getRange("A13:B16").format = { fill: "#FFFFFF", borders: { preset: "all", style: "thin", color: border } };
info.getRange("A18:H18").merge();
info.getRange("A18").values = [["版本冻结规则：业务确认后，产品组统一修订PRD，并将确认结论、确认人、日期和依据附件作为评审记录保存。"]];
info.getRange("A18:H18").format = { fill: orange, wrapText: true, font: { bold: true, color: "#7C4A03" } };
info.getRange("A18:H18").format.rowHeight = 32;
info.getRange("A:A").format.columnWidth = 12;
info.getRange("B:H").format.columnWidth = 18;
info.freezePanes.freezeRows(2);

// 待确认事项
const pending = wb.worksheets.add("待确认事项");
pending.showGridLines = false;
title(pending, "A1:M1", "必须由业务方确认的事项");
pending.getRange("A2:M2").values = [["编号", "模块", "确认问题", "建议默认口径", "建议确认人", "不确认的影响", "PRD依据", "优先级", "业务结论", "确认人", "确认日期", "是否影响周期/费用", "备注"]];
headerStyle(pending.getRange("A2:M2"));
const pendingValues = confirmRows.map((row) => [row["编号"], row["模块"], row["确认问题"], row["建议默认口径"], row["建议确认人"], row["不确认的影响"], row["PRD 依据"], row["编号"] <= "B-10" ? "高" : row["编号"] <= "B-22" ? "高" : "中", "", "", "", "", ""]);
pending.getRange(`A3:M${pendingValues.length + 2}`).values = pendingValues;
bodyStyle(pending.getRange(`A3:M${pendingValues.length + 2}`));
pending.getRange(`A3:A${pendingValues.length + 2}`).format = { fill: blue, font: { bold: true }, horizontalAlignment: "center", verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
pending.getRange(`H3:H${pendingValues.length + 2}`).dataValidation = { rule: { type: "list", values: ["高", "中", "低"] } };
pending.getRange(`L3:L${pendingValues.length + 2}`).dataValidation = { rule: { type: "list", values: ["是", "否", "待评估"] } };
pending.getRange(`K3:K${pendingValues.length + 2}`).setNumberFormat("yyyy-mm-dd");
pending.getRange(`I3:I${pendingValues.length + 2}`).format = { fill: orange, wrapText: true, verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
pending.getRange(`J3:L${pendingValues.length + 2}`).format = { fill: "#FFFDF5", wrapText: true, verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
pending.getRange(`A3:M${pendingValues.length + 2}`).format.rowHeight = 82;
const widths = [9, 16, 36, 38, 20, 34, 28, 10, 34, 14, 14, 18, 26];
widths.forEach((w, i) => pending.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
pending.freezePanes.freezeRows(2);
pending.tables.add(`A2:M${pendingValues.length + 2}`, true, "PendingConfirmations");

// 已确认口径
const confirmedSheet = wb.worksheets.add("已确认口径");
confirmedSheet.showGridLines = false;
title(confirmedSheet, "A1:E1", "已确认口径（不再重复询问）");
confirmedSheet.getRange("A2:E2").values = [["编号", "已确认业务口径", "确认状态", "确认日期", "备注"]];
headerStyle(confirmedSheet.getRange("A2:E2"));
confirmedSheet.getRange(`A3:E${confirmed.length + 2}`).values = confirmed.map(([id, text]) => [id, text, "已确认", "2026-08-05", ""]);
bodyStyle(confirmedSheet.getRange(`A3:E${confirmed.length + 2}`));
confirmedSheet.getRange(`A3:A${confirmed.length + 2}`).format = { fill: green, font: { bold: true }, horizontalAlignment: "center", verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
confirmedSheet.getRange(`C3:C${confirmed.length + 2}`).format = { fill: green, horizontalAlignment: "center", verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
confirmedSheet.getRange(`D3:D${confirmed.length + 2}`).setNumberFormat("yyyy-mm-dd");
confirmedSheet.getRange(`A3:E${confirmed.length + 2}`).format.rowHeight = 38;
[10, 75, 14, 14, 28].forEach((w, i) => confirmedSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
confirmedSheet.freezePanes.freezeRows(2);
confirmedSheet.tables.add(`A2:E${confirmed.length + 2}`, true, "ConfirmedRules");

// 文档冲突
const conflictSheet = wb.worksheets.add("文档冲突");
conflictSheet.showGridLines = false;
title(conflictSheet, "A1:D1", "PRD文档中需要统一的口径冲突");
conflictSheet.getRange("A2:D2").values = [["编号", "当前冲突", "建议处理", "处理结论"]];
headerStyle(conflictSheet.getRange("A2:D2"));
conflictSheet.getRange(`A3:D${conflicts.length + 2}`).values = conflicts.map((row) => [row["编号"], row["当前冲突"], row["建议处理"], ""]);
bodyStyle(conflictSheet.getRange(`A3:D${conflicts.length + 2}`));
conflictSheet.getRange(`A3:A${conflicts.length + 2}`).format = { fill: red, font: { bold: true }, horizontalAlignment: "center", verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
conflictSheet.getRange(`D3:D${conflicts.length + 2}`).format = { fill: orange, wrapText: true, verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
conflictSheet.getRange(`A3:D${conflicts.length + 2}`).format.rowHeight = 72;
[10, 54, 54, 34].forEach((w, i) => conflictSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
conflictSheet.freezePanes.freezeRows(2);
conflictSheet.tables.add(`A2:D${conflicts.length + 2}`, true, "PrdConflicts");

// 可后置事项
const deferredSheet = wb.worksheets.add("可后置事项");
deferredSheet.showGridLines = false;
title(deferredSheet, "A1:D1", "可后置确认或二期事项");
deferredSheet.getRange("A2:D2").values = [["编号", "事项", "建议处理", "业务意见"]];
headerStyle(deferredSheet.getRange("A2:D2"));
deferredSheet.getRange(`A3:D${deferred.length + 2}`).values = deferred.map(([id, text]) => [id, text, "接口预留或二期", ""]);
bodyStyle(deferredSheet.getRange(`A3:D${deferred.length + 2}`));
deferredSheet.getRange(`A3:A${deferred.length + 2}`).format = { fill: blue, font: { bold: true }, horizontalAlignment: "center", verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
deferredSheet.getRange(`D3:D${deferred.length + 2}`).format = { fill: orange, wrapText: true, verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
deferredSheet.getRange(`A3:D${deferred.length + 2}`).format.rowHeight = 45;
[10, 78, 24, 36].forEach((w, i) => deferredSheet.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
deferredSheet.freezePanes.freezeRows(2);
deferredSheet.tables.add(`A2:D${deferred.length + 2}`, true, "DeferredItems");

// 确认顺序
const order = wb.worksheets.add("确认顺序");
order.showGridLines = false;
title(order, "A1:F1", "建议业务确认顺序");
order.getRange("A2:F2").values = [["轮次", "优先确认范围", "涉及模块", "为什么先确认", "建议参与人", "完成标志"]];
headerStyle(order.getRange("A2:F2"));
order.getRange("A3:F5").values = [
  ["第一轮", "B-01～B-22", "范围、角色、风险、巡检、隐患、特殊作业", "直接决定数据库、流程、权限和首批验收", "项目负责人、公司安环、试点单位负责人、信息化", "形成书面结论并标注制度或附件依据"],
  ["第二轮", "B-23～B-30", "移动端、消息、驾驶舱、数据和验收", "直接决定现场入口、指标口径和验收样本", "项目负责人、信息化、领导使用人、试点单位", "形成指标字典、数据责任人和验收样本清单"],
  ["统一修订", "C-01～C-06", "PRD冲突", "避免各模块文档继续出现不同口径", "产品经理、开发负责人、业务确认人", "PRD统一更新并保留变更记录"],
];
bodyStyle(order.getRange("A3:F5"));
order.getRange("A3:A5").format = { fill: blue, font: { bold: true }, horizontalAlignment: "center", verticalAlignment: "top", borders: { preset: "inside", style: "thin", color: border } };
order.getRange("A3:F5").format.rowHeight = 62;
[12, 18, 28, 42, 34, 34].forEach((w, i) => order.getRangeByIndexes(0, i, 1, 1).format.columnWidth = w);
order.freezePanes.freezeRows(2);
order.tables.add("A2:F5", true, "ConfirmationOrder");

// Export and verification artifacts
await fs.mkdir(outputDir, { recursive: true });
const check = await wb.inspect({ kind: "table", range: "待确认事项!A1:M8", include: "values,formulas", tableMaxRows: 8, tableMaxCols: 13, maxChars: 5000 });
await fs.writeFile(path.join(outputDir, "inspect_pending.ndjson"), check.ndjson ?? String(check), "utf8");
const errors = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
await fs.writeFile(path.join(outputDir, "formula_errors.ndjson"), errors.ndjson ?? String(errors), "utf8");
for (const sheetName of ["使用说明", "待确认事项", "已确认口径", "文档冲突", "可后置事项", "确认顺序"]) {
  const preview = await wb.render({ sheetName, autoCrop: "all", scale: 1, format: "png" });
  await fs.writeFile(path.join(outputDir, `${sheetName}.png`), new Uint8Array(await preview.arrayBuffer()));
}
const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(path.join(outputDir, "安全管理平台PRD业务确认清单_20260805.xlsx"));
console.log(JSON.stringify({ confirmCount: confirmRows.length, confirmedCount: confirmed.length, conflictCount: conflicts.length, deferredCount: deferred.length, output: path.join(outputDir, "安全管理平台PRD业务确认清单_20260805.xlsx") }));
