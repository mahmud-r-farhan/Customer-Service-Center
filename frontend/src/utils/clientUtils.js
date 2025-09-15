export const calculateConsultationTime = (client) => {
  if (client.consultationStart && client.updatedAt) {
    const start = new Date(client.consultationStart);
    const end = new Date(client.updatedAt);
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    return `${minutes} min`;
  }
  return "N/A";
};