"use client"

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/searchbar';
import { getApodData, getAsteroidData } from '@/utils/nasaApi';
import img from 'next/image';

const DataAnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [outputContent, setOutputContent] = useState('No active output');
  const [searchQuery, setSearchQuery] = useState('');
  const [nasaData, setNasaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample data for demonstration
  const sampleData = [
    { id: 1, name: 'John Doe', age: 32, department: 'Marketing', salary: 55000 },
    { id: 2, name: 'Jane Smith', age: 28, department: 'Sales', salary: 62000 },
    { id: 3, name: 'Robert Johnson', age: 45, department: 'Engineering', salary: 85000 },
    { id: 4, name: 'Emily Davis', age: 29, department: 'Marketing', salary: 58000 },
    { id: 5, name: 'Michael Wilson', age: 35, department: 'Engineering', salary: 92000 }
  ];

  useEffect(() => {
    // Fetch NASA data when the component mounts
    if (activeTab === 'nasa') {
      fetchNasaData();
    }
  }, [activeTab]);

  const fetchNasaData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getApodData();
      setNasaData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch NASA data. Please try again later.');
      setLoading(false);
      console.error('NASA API Error:', err);
    }
  };

  const handleOperationClick = (operation) => {
    setOutputContent(`${operation} operation performed on data.`);
    setActiveTab('output');
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredData = sampleData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderNasaData = () => {
  if (loading) return <div className="loading">Loading NASA data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!nasaData) return <div className="loading">No data available</div>;
  
  return (
    <div className="nasa-data-container">
      <h3>NASA Astronomy Picture of the Day</h3>
      <div className="apod-card">
        <div className="apod-image">
          {/* Using regular img tag to avoid Next.js Image requirements */}
          <img src={nasaData.url} alt={nasaData.title} />
        </div>
        <div className="apod-details">
          <h4>{nasaData.title} - <span className="date">{nasaData.date}</span></h4>
          <p>{nasaData.explanation}</p>
          {nasaData.copyright && (
            <p className="copyright">Copyright: {nasaData.copyright}</p>
          )}
        </div>
      </div>
      
      <div className="real-time-table">
        <h4>Image Metadata</h4>
        <table>
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Title</td>
              <td>{nasaData.title}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{nasaData.date}</td>
            </tr>
            <tr>
              <td>Media Type</td>
              <td>{nasaData.media_type}</td>
            </tr>
            <tr>
              <td>Service Version</td>
              <td>{nasaData.service_version}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
  const renderOutput = () => {
    switch(activeTab) {
      case 'input':
        return (
          <div className="table-container">
            <h3>Sample Data</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Department</th>
                  <th>Salary</th>
                </tr>
              </thead>
              <tbody>
                {sampleData.map(row => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.age}</td>
                    <td>{row.department}</td>
                    <td>${row.salary.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'graph':
        return (
          <div className="graph-container">
            <h3>Salary Distribution</h3>
            <div className="bar-graph">
              {sampleData.map(item => (
                <div key={item.id} className="bar-container">
                  <div className="bar" style={{height: `${item.salary/2000}px`}}></div>
                  <span className="bar-label">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'nasa':
        return renderNasaData();
      default:
        return <p>{outputContent}</p>;
    }
  };

  return (
    <div className="dashboard">
      <SearchBar onSearch={handleSearch} placeholder="Search data..." />
      <div className="sidebar">
        <div className="logo">
          <i className="fas fa-chart-bar"></i>
          <span>Workspace</span>
        </div>
        
        <div className="menu">
          <div 
            className={`menu-item ${activeTab === 'input' ? 'active' : ''}`}
            onClick={() => setActiveTab('input')}
          >
            <i className="fas fa-table"></i>
            <span>Input Table</span>
          </div>
          
          <div 
            className={`menu-item ${activeTab === 'output' ? 'active' : ''}`}
            onClick={() => setActiveTab('output')}
          >
            <i className="fas fa-columns"></i>
            <span>Table Output</span>
          </div>
          
          <div 
            className={`menu-item ${activeTab === 'graph' ? 'active' : ''}`}
            onClick={() => setActiveTab('graph')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Graph Output</span>
          </div>

          {/* Add NASA Data menu item */}
          <div 
            className={`menu-item ${activeTab === 'nasa' ? 'active' : ''}`}
            onClick={() => setActiveTab('nasa')}
          >
            <i className="fas fa-rocket"></i>
            <span>NASA Data</span>
          </div>
        </div>
        
        <div className="operations">
          <h3>Data Operations</h3>
          
          <div className="operation-buttons">
            <button 
              className="op-btn"
              onClick={() => handleOperationClick('Filter')}
            >
              <i className="fas fa-filter"></i>
              Filter
            </button>
            
            <button 
              className="op-btn"
              onClick={() => handleOperationClick('Group By')}
            >
              <i className="fas fa-object-group"></i>
              Group By
            </button>
            
            <button 
              className="op-btn"
              onClick={() => handleOperationClick('Join')}
            >
              <i className="fas fa-link"></i>
              Join
            </button>
            
            <button 
              className="op-btn"
              onClick={() => handleOperationClick('Drop')}
            >
              <i className="fas fa-trash-alt"></i>
              Drop
            </button>
            
            <button 
              className="op-btn"
              onClick={() => handleOperationClick('Sort')}
            >
              <i className="fas fa-sort"></i>
              Sort
            </button>
            
            <button 
              className="op-btn"
              onClick={() => handleOperationClick('Merge')}
            >
              <i className="fas fa-merge"></i>
              Merge
            </button>
            
            <button 
              className="op-btn"
              onClick={() => handleOperationClick('Export')}
            >
              <i className="fas fa-file-export"></i>
              Export
            </button>

            {/* Refresh NASA Data button */}
            {activeTab === 'nasa' && (
              <button 
                className="op-btn"
                onClick={fetchNasaData}
                disabled={loading}
              >
                <i className="fas fa-sync"></i>
                {loading ? 'Refreshing...' : 'Refresh Data'}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="main-content">
        <div className="header">
          <h2>
            {activeTab === 'input' && 'Input Data Table'}
            {activeTab === 'output' && 'Table Output'}
            {activeTab === 'graph' && 'Graph Output'}
            {activeTab === 'nasa' && 'NASA Space Data'}
          </h2>
        </div>
        
        <div className="output-container">
          {renderOutput()}
        </div>
      </div>
    </div>
  );
};

export default DataAnalysisDashboard;