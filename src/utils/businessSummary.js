export function generateBusinessSummary(data) {

  const rows = data?.rows || [];

  return {
    totalRows: rows.length,
    sampleRecords: rows.slice(0, 20),
    columns: data?.columns || []
  };
}
