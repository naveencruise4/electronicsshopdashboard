import React, { useState } from 'react';
import Upload from './components/Upload';
import Dashboard from './components/Dashboard';
import './App.css';

export default function App() {
  const [excelData, setExcelData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = (data, name) => {
    try {
      setExcelData(data);
      setFileName(name);
      setError(null);
      console.log('Data loaded:', data);
    } catch (err) {
      setError('Error processing file: ' + err.message);
    }
  };

  const handleReset = () => {
    setExcelData(null);
    setFileName(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📊 Excel Dashboard Creator</h1>
        <p>Upload your Excel file and get instant visual insights</p>
      </header>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {!excelData ? (
        <Upload onFileUpload={handleFileUpload} />
      ) : (
        <Dashboard 
          data={excelData} 
          fileName={fileName} 
          onReset={handleReset}
        />
      )}

      <footer className="app-footer">
        <p>💡 Upload any Excel file. No registration. No cost. 100% Private.</p>
        <p>All processing happens in your browser. Your data never leaves your device.</p>
      </footer>
    </div>
  );
}
