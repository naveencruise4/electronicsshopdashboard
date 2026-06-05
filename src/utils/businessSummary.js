export function generateBusinessSummary(data) {
  return {
    totalRows: data.length,

    sampleRecords: data.slice(0, 20),

    columns: Object.keys(data[0] || {})
  };
}
