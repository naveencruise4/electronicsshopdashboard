import React, { useState } from 'react';
import './DataTable.css';

export default function DataTable({ data, columns, total, filtered }) {
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortBy) return 0;
    
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="data-table-container">
      <div className="table-info">
        <p>Showing {filtered} of {total} rows</p>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                  {col}
                  {sortBy === col && <span> {sortOrder === 'asc' ? '▲' : '▼'}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.slice(0, 100).map((row, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={`${idx}-${col}`}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length > 100 && (
        <p className="truncated-notice">Showing first 100 rows. Total rows: {sortedData.length}</p>
      )}
    </div>
  );
}
