import React, { useState } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap/LeafletMap';
import Info from './components/Info';

const App = () => {
  const mapCenter = [50.4501, 30.5234];
  const mapZoom = 12;
  const [features, setFeatures] = useState([])
  return (
    <div className="App">
      <LeafletMap
        center={mapCenter}
        zoom={mapZoom}
        setFeatures={(e) => setFeatures(e)}
      />
      <Info features={features} />
    </div>
  );
};

export default App;
