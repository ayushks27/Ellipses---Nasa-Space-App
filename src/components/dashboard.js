"use client"

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/searchbar';
import { getApodData } from '@/utils/nasaApi';

const DataAnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState('input');
  const [outputContent, setOutputContent] = useState('No active output');
  const [searchQuery, setSearchQuery] = useState('');
  const [nasaData, setNasaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [planetaryData, setPlanetaryData] = useState([]);

  // Fetch NASA APOD data
  useEffect(() => {
    if (activeTab === 'nasa') fetchNasaData();
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

  // Fetch planetary data from API route
  const fetchPlanetaryData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/planetary'); // API route in app directory
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      setPlanetaryData(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch planetary data. ' + err.message);
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === 'input' || activeTab === 'graph' || activeTab === 'output') {
      fetchPlanetaryData();
    }
  }, [activeTab]);

  const handleOperationClick = (operation) => {
    setOutputContent(`${operation} operation performed on data.`);
    setActiveTab('output');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredData = planetaryData.filter(item => 
    item.englishName.toLowerCase().includes(searchQuery.toLowerCase())
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
      </div>
    );
  };

  const renderOutput = () => {
    switch(activeTab) {
      case 'input':
        return (
          <div className="table-container">
            <h3>Real-Time Planetary Data</h3>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mass (kg)</th>
                    <th>Gravity (m/s²)</th>
                    <th>Mean Radius (km)</th>
                    <th>Orbital Period (days)</th>
                    <th>Moons</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(planet => (
                    <tr key={planet.id}>
                      <td>{planet.englishName}</td>
                      <td>{planet.mass?.massValue ? (planet.mass.massValue * Math.pow(10, planet.mass.massExponent)).toLocaleString() : 'N/A'}</td>
                      <td>{planet.gravity}</td>
                      <td>{planet.meanRadius}</td>
                      <td>{planet.sideralOrbit}</td>
                      <td>{planet.moons ? planet.moons.length : 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'output':
        return (
          <div className="table-container">
            <h3>Planetary Data Output (Sorted by Mass)</h3>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Mass (kg)</th>
                    <th>Mean Radius (km)</th>
                    <th>Number of Moons</th>
                  </tr>
                </thead>
                <tbody>
                  {planetaryData
                    .sort((a, b) => (b.mass?.massValue || 0) - (a.mass?.massValue || 0))
                    .map(planet => (
                      <tr key={planet.id}>
                        <td>{planet.englishName}</td>
                        <td>{planet.mass?.massValue ? (planet.mass.massValue * Math.pow(10, planet.mass.massExponent)).toLocaleString() : 'N/A'}</td>
                        <td>{planet.meanRadius}</td>
                        <td>{planet.moons ? planet.moons.length : 0}</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      case 'graph':
        return (
          <div className="graph-container">
            <h3>Planetary Radius Comparison</h3>
            {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
              <div className="bar-graph">
                {planetaryData.map(planet => (
                  <div key={planet.id} className="bar-container">
                    <div className="bar" style={{ height: `${planet.meanRadius / 100}px` }}></div>
                    <span className="bar-label">{planet.englishName}</span>
                  </div>
                ))}
              </div>
            )}
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
            <button className="op-btn" onClick={() => handleOperationClick('Filter')}>
              <i className="fas fa-filter"></i> Filter
            </button>
            <button className="op-btn" onClick={() => handleOperationClick('Group By')}>
              <i className="fas fa-object-group"></i> Group By
            </button>
            <button className="op-btn" onClick={() => handleOperationClick('Join')}>
              <i className="fas fa-link"></i> Join
            </button>
            <button className="op-btn" onClick={() => handleOperationClick('Drop')}>
              <i className="fas fa-trash-alt"></i> Drop
            </button>
            <button className="op-btn" onClick={() => handleOperationClick('Sort')}>
              <i className="fas fa-sort"></i> Sort
            </button>
            <button className="op-btn" onClick={() => handleOperationClick('Merge')}>
              <i className="fas fa-merge"></i> Merge
            </button>
            <button className="op-btn" onClick={() => handleOperationClick('Export')}>
              <i className="fas fa-file-export"></i> Export
            </button>
            {activeTab === 'nasa' && (
              <button className="op-btn" onClick={fetchNasaData} disabled={loading}>
                <i className="fas fa-sync"></i> {loading ? 'Refreshing...' : 'Refresh Data'}
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
