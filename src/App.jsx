import React from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap/LeafletMap';

const App = () => {
  const mapCenter = [50.4501, 30.5234];
  const mapZoom = 12;

  return (
    <div className="App">
      <LeafletMap
        center={mapCenter}
        zoom={mapZoom}
      />
    </div>
  );
};

export default App;
