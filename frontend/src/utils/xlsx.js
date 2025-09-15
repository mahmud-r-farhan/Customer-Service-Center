import * as XLSX from 'xlsx';

export const exportToExcel = (data, sheetName = "Data", filename) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
};

export const prepareAndExportLast24hClients = (clients) => {
  const now = new Date();
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const last24Clients = clients.filter(c => new Date(c.createdAt) >= last24h);
  const data = last24Clients.map(c => ({
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
  exportToExcel(data, "Last 24 Hours", filename);
  return filename;
};