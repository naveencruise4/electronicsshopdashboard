export function generateCharts(data, chartType) {
  const analysis = data.analysis;
  const charts = [];

  const numericCols = Object.keys(analysis)
    .filter(col => analysis[col].type === 'number');

  const textCols = Object.keys(analysis)
    .filter(col => analysis[col].type === 'text');

  if (chartType === 'auto') {
    if (numericCols.length > 0 && textCols.length > 0) {
      charts.push(generateBarChart(data.rows, textCols[0], numericCols[0]));
      
      if (numericCols.length > 1) {
        charts.push(generateLineChart(data.rows, textCols[0] || 'Index', numericCols));
      }
    } else if (numericCols.length >= 2) {
      charts.push(generateLineChart(data.rows, textCols[0] || 'Index', numericCols));
    } else if (textCols.length > 0 && numericCols.length > 0) {
      charts.push(generatePieChart(data.rows, textCols[0], numericCols[0]));
    }

    charts.push(generateSummaryStats(data));
  } else if (chartType === 'bar') {
    if (numericCols.length > 0 && textCols.length > 0) {
      charts.push(generateBarChart(data.rows, textCols[0], numericCols[0]));
    }
  } else if (chartType === 'line') {
    if (numericCols.length > 0) {
      charts.push(generateLineChart(data.rows, textCols[0] || 'Index', numericCols));
    }
  } else if (chartType === 'pie') {
    if (textCols.length > 0 && numericCols.length > 0) {
      charts.push(generatePieChart(data.rows, textCols[0], numericCols[0]));
    }
  }

  return charts;
}

function generateBarChart(rows, xCol, yCol) {
  const grouped = {};
  rows.forEach(row => {
    const key = row[xCol] || 'Unknown';
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += parseFloat(row[yCol]) || 0;
  });

  return {
    type: 'bar',
    title: `${yCol} by ${xCol}`,
    data: Object.entries(grouped).slice(0, 20).map(([key, value]) => ({
      name: String(key).substring(0, 20),
      value: parseFloat(value).toFixed(2)
    })),
    xCol: xCol,
    yCol: yCol
  };
}

function generateLineChart(rows, xCol, yCols) {
  const data = rows.slice(0, 50).map(row => {
    const entry = { name: String(row[xCol] || 'Unknown').substring(0, 15) };
    yCols.forEach(col => {
      entry[col] = parseFloat(row[col]) || 0;
    });
    return entry;
  });

  return {
    type: 'line',
    title: 'Trend Analysis',
    data: data,
    columns: yCols
  };
}

function generatePieChart(rows, labelCol, valueCol) {
  const grouped = {};
  rows.forEach(row => {
    const key = row[labelCol] || 'Unknown';
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += parseFloat(row[valueCol]) || 0;
  });

  return {
    type: 'pie',
    title: `Distribution of ${valueCol}`,
    data: Object.entries(grouped).slice(0, 10).map(([key, value]) => ({
      name: String(key).substring(0, 20),
      value: parseFloat(value).toFixed(2)
    }))
  };
}

function generateSummaryStats(data) {
  const stats = {};
  Object.keys(data.analysis).forEach(col => {
    const analysis = data.analysis[col];
    if (analysis.type === 'number') {
      const values = analysis.values.map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (values.length > 0) {
        stats[col] = {
          sum: values.reduce((a, b) => a + b, 0),
          avg: (values.reduce((a, b) => a + b, 0) / values.length),
          max: Math.max(...values),
          min: Math.min(...values),
          count: values.length
        };
      }
    }
  });

  return {
    type: 'stats',
    title: 'Summary Statistics',
    data: stats
  };
}
