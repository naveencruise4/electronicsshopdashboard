import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export async function parseExcel(file) {
  return new Promise((resolve, reject) => {
    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const data = processData(results.data);
          resolve(data);
        },
        error: (error) => reject(error)
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          const processed = processData(jsonData);
          resolve(processed);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  });
}

function processData(rawData) {
  const data = rawData.filter(row => {
    return Object.values(row).some(val => val !== null && val !== undefined && val !== '');
  });

  if (data.length === 0) {
    throw new Error('No data found in file');
  }

  const columns = Object.keys(data[0]);
  const analysis = analyzeColumns(data, columns);

  return {
    rows: data,
    columns: columns,
    rowCount: data.length,
    analysis: analysis
  };
}

function analyzeColumns(data, columns) {
  const analysis = {};

  columns.forEach(col => {
    const values = data.map(row => row[col]).filter(v => v !== null && v !== undefined && v !== '');
    
    let dataType = 'text';
    let isNumeric = true;
    let isDate = true;

    for (let val of values) {
      if (isNaN(val)) isNumeric = false;
      if (isNaN(Date.parse(val))) isDate = false;
    }

    if (isNumeric && values.length > 0) dataType = 'number';
    else if (isDate && values.length > 0) dataType = 'date';

    analysis[col] = {
      type: dataType,
      count: values.length,
      uniqueValues: new Set(values).size,
      values: values
    };
  });

  return analysis;
}
