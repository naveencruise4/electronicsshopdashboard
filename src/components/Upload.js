import React, { useState } from 'react';
import { parseExcel } from '../utils/excelParser';
import './Upload.css';

export default function Upload({ onFileUpload }) {
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      alert('Please upload an Excel file (.xlsx, .xls) or CSV');
      return;
    }

    setLoading(true);
    try {
      const data = await parseExcel(file);
      onFileUpload(data, file.name);
    } catch (error) {
      alert('Error reading file: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-area ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your file...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <h2>Drop your Excel file here</h2>
            <p>or click to browse</p>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => handleFile(e.target.files[0])}
              style={{ display: 'none' }}
              id="file-input"
            />
            <label htmlFor="file-input" className="file-input-label">
              Choose File
            </label>
            <p className="supported-formats">
              Supported: Excel (.xlsx, .xls) or CSV
            </p>
          </>
        )}
      </div>

      <div className="upload-info">
        <h3>📝 How it works:</h3>
        <ol>
          <li>Upload your Excel/CSV file</li>
          <li>System analyzes the data</li>
          <li>Get instant visual dashboard</li>
          <li>Filter, sort, and export</li>
          <li>Share with others (optional)</li>
        </ol>

        <h3>✨ Features:</h3>
        <ul>
          <li>✅ Automatic chart generation</li>
          <li>✅ Interactive filters</li>
          <li>✅ Data sorting & searching</li>
          <li>✅ Summary statistics</li>
          <li>✅ 100% private (no server storage)</li>
          <li>✅ Works offline</li>
        </ul>

        <h3>💡 Sample Data:</h3>
        <p>Try uploading sample data with:</p>
        <ul>
          <li>📌 Sales data (Date, Amount, Product)</li>
          <li>📌 Inventory (Product, Quantity, Price)</li>
          <li>📌 Customer info (Name, City, Purchase)</li>
        </ul>

        <h3>⚠️ Privacy:</h3>
        <p>Your data is processed entirely in your browser. Nothing is sent to our servers. It's completely private and secure!</p>
      </div>
    </div>
  );
}
