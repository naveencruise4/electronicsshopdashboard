import React, { useState, useMemo } from 'react';
import Charts from './Charts';
import DataTable from './DataTable';
import { generateCharts } from '../utils/chartGenerator';
import './Dashboard.css';
import AIAssistant from "./AIAssistant";
import { generateBusinessSummary } from "../utils/businessSummary";


export default function Dashboard({ data, fileName, onReset }) {
  const [chartType, setChartType] = useState('auto');
  const [filterText, setFilterText] = useState('');

  const summary = useMemo(() => {
    try {
      return generateBusinessSummary(data);
    } catch (err) {
      console.error("Summary generation failed:", err);
      return {};
    }
  }, [data]);

  const charts = useMemo(() => {
    return generateCharts(data, chartType);
  }, [data, chartType]);

  const filteredData = useMemo(() => {
    if (!filterText) return data.rows;
    return data.rows.filter(row => {
      return Object.values(row).some(val => 
        String(val).toLowerCase().includes(filterText.toLowerCase())
      );
    });
  }, [data, filterText]);

  const handleExportPDF = () => {
    alert('Export as PDF - Coming soon!');
  };

  const handleExportImage = () => {
    alert('Export as Image - Coming soon!');
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h2>📊 {fileName}</h2>
          <p>{data.rowCount} rows | {data.columns.length} columns</p>
        </div>
        <div className="header-actions">
          <button onClick={onReset} className="btn btn-secondary">
            ← Upload Another File
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <div className="control-group">
          <label>Chart Type:</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
            <option value="auto">Auto (Recommended)</option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <div className="control-group">
          <label>Search Data:</label>
          <input
            type="text"
            placeholder="Type to filter..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Actions:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleExportPDF} className="btn btn-primary" style={{ flex: 1 }}>
              📥 PDF
            </button>
            <button onClick={handleExportImage} className="btn btn-primary" style={{ flex: 1 }}>
              📥 Image
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <h3>📈 Visual Insights</h3>
        <Charts charts={charts} />
      </div>

      {/* Data Table Section */}
      <div className="table-section">
        <h3>📋 Data Details</h3>
        <DataTable 
          data={filteredData} 
          columns={data.columns}
          total={data.rowCount}
          filtered={filteredData.length}
        />
      </div>

      {/* AI Assistant */}
      <div className="assistant-section">
        <h3>🤖 AI Operations Assistant</h3>
        <AIAssistant summary={summary} />
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>💡 All data is processed locally in your browser. Nothing is stored on servers.</p>
        <p>Built with ❤️ for small business owners</p>
      </div>
    </div>
  );
}
