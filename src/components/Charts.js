import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Charts.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

export default function Charts({ charts }) {
  return (
    <div className="charts-container">
      {charts.map((chart, idx) => (
        <div key={idx} className="chart-box">
          <h4>{chart.title}</h4>
          
          {chart.type === 'bar' && (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}

          {chart.type === 'line' && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chart.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {chart.columns && chart.columns.map((col, i) => (
                  <Line 
                    key={col} 
                    type="monotone" 
                    dataKey={col} 
                    stroke={COLORS[i % COLORS.length]}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}

          {chart.type === 'pie' && (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chart.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chart.data && chart.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}

          {chart.type === 'stats' && (
            <div className="stats-grid">
              {Object.entries(chart.data || {}).map(([col, stats]) => (
                <div key={col} className="stat-card">
                  <h5>{col}</h5>
                  <div className="stat-value">
                    <p><strong>Sum:</strong> {typeof stats.sum === 'number' ? stats.sum.toFixed(2) : 0}</p>
                    <p><strong>Avg:</strong> {stats.avg || 0}</p>
                    <p><strong>Max:</strong> {stats.max || 0}</p>
                    <p><strong>Min:</strong> {stats.min || 0}</p>
                    <p><strong>Count:</strong> {stats.count || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
