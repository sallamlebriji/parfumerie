// Export CSV généré dans le navigateur (séparateur « ; » et BOM pour une ouverture correcte dans Excel).
export const exportCsv = (rows, keys, filename = "export.csv") => {
  const cell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const lines = [keys.join(";"), ...rows.map((row) => keys.map((key) => cell(row[key])).join(";"))];
  const blob = new Blob([String.fromCharCode(0xfeff), lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
