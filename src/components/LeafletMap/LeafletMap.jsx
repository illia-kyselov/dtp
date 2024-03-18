import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LayerControl from '../LayerControl/LayerControl';

const LeafletMap = ({ center, zoom, setFeatures }) => {
  
  return (
    <MapContainer preferCanvas={true} center={center} zoom={zoom} style={{ height: '100vh', width: '100%' }}>
      <LayerControl setFeatures={setFeatures} />
    </MapContainer>
  );
};

export default LeafletMap;
