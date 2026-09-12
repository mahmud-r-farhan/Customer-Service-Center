// `xlsx` is a fairly large dependency, so it is dynamically imported only when
// an export is actually triggered. This keeps it out of the main/Dashboard
// bundle and speeds up initial page load.
const loadXLSX = () => import('xlsx');

export const exportToExcel = async (data, sheetName = "Data", filename) => {
  const XLSX = await loadXLSX();
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

export const prepareAndExportLast24hClients = async (clients) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last24Clients = (clients || []).filter((c) => new Date(c.createdAt) >= last24h);

  if (last24Clients.length === 0) {
    throw new Error("No client records from the last 24 hours to export");
  }

  const data = last24Clients.map((c) => ({
    Name: c.name,
    Phone: c.number,
    Token: c.token,
    Status: c.status,
    Created: new Date(c.createdAt).toLocaleString(),
    ConsultationTime: c.consultationStart && c.updatedAt
      ? `${Math.floor((new Date(c.updatedAt) - new Date(c.consultationStart)) / 60000)} min`
      : "N/A",
    Agent: c.agent || "N/A"
  }));
  const filename = `queue-clients-${now.toISOString().split('T')[0]}.xlsx`;
  await exportToExcel(data, "Last 24 Hours", filename);
  return filename;
};
