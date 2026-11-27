const encoder = new TextEncoder();

function xml(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// XLSX uses ZIP containers. Store these small XML parts without compression.
function zip(files) {
  const parts = [];
  const directory = [];
  let offset = 0;
  for (const [path, contents] of Object.entries(files)) {
    const name = encoder.encode(path);
    const data = encoder.encode(contents);
    let crc = 0xffffffff;
    for (const byte of data) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    const header = new Uint8Array(30 + name.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(12, 33, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, name.length, true);
    header.set(name, 30);
    const entry = new Uint8Array(46 + name.length);
    const index = new DataView(entry.buffer);
    index.setUint32(0, 0x02014b50, true);
    index.setUint16(4, 20, true);
    index.setUint16(6, 20, true);
    index.setUint16(14, 33, true);
    index.setUint32(16, crc, true);
    index.setUint32(20, data.length, true);
    index.setUint32(24, data.length, true);
    index.setUint16(28, name.length, true);
    index.setUint32(42, offset, true);
    entry.set(name, 46);
    parts.push(header, data);
    directory.push(entry);
    offset += header.length + data.length;
  }
  const end = new Uint8Array(22);
  const view = new DataView(end.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, directory.length, true);
  view.setUint16(10, directory.length, true);
  view.setUint32(12, directory.reduce((size, entry) => size + entry.length, 0), true);
  view.setUint32(16, offset, true);
  return new Blob([...parts, ...directory, end], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function createShortlistWorkbook(students) {
  const rows = [["Rank", "Name", "Roll number", "Branch", "10th %", "12th %", "UG CGPA", "PG CGPA", "Active backlogs", "Resume link"],
    ...students.map((student, index) => [index + 1, student.name, student.rollNo, student.branch,
      student.tenthPercentage, student.twelfthPercentage, student.ugCgpa, student.pgCgpa,
      student.activeBacklogs, student.resumeLink])];
  const sheet = rows.map((row, index) => `<row r="${index + 1}">${row.map((value, column) => {
    const reference = `${String.fromCharCode(65 + column)}${index + 1}`;
    if (typeof value === "number" && Number.isFinite(value)) return `<c r="${reference}"><v>${value}</v></c>`;
    // Explicit strings preserve roll-number zeros and keep user input as text.
    return `<c r="${reference}" t="inlineStr"><is><t xml:space="preserve">${xml(value)}</t></is></c>`;
  }).join("")}</row>`).join("");
  const ns = "http://schemas.openxmlformats.org";
  return zip({
    "[Content_Types].xml": `<Types xmlns="${ns}/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
    "_rels/.rels": `<Relationships xmlns="${ns}/package/2006/relationships"><Relationship Id="rId1" Type="${ns}/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
    "xl/workbook.xml": `<workbook xmlns="${ns}/spreadsheetml/2006/main" xmlns:r="${ns}/officeDocument/2006/relationships"><sheets><sheet name="Shortlisted candidates" sheetId="1" r:id="rId1"/></sheets></workbook>`,
    "xl/_rels/workbook.xml.rels": `<Relationships xmlns="${ns}/package/2006/relationships"><Relationship Id="rId1" Type="${ns}/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
    "xl/worksheets/sheet1.xml": `<worksheet xmlns="${ns}/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="8" customWidth="1"/><col min="2" max="4" width="25" customWidth="1"/><col min="5" max="9" width="16" customWidth="1"/><col min="10" max="10" width="50" customWidth="1"/></cols><sheetData>${sheet}</sheetData><autoFilter ref="A1:J${rows.length}"/></worksheet>`,
  });
}

export function downloadShortlist(students, name) {
  const url = URL.createObjectURL(createShortlistWorkbook(students));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_").slice(0, 100)}-shortlist.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
