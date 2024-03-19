import React from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LayerControl from '../LayerControl/LayerControl';
import WfsLayer from '../WfsLayer';

const LeafletMap = ({ center, zoom, setFeatures }) => {
  
  return (
    <MapContainer preferCanvas={true} center={center} zoom={zoom} style={{ height: '85vh', width: '100%' }}>
      <LayerControl setFeatures={setFeatures} />
      <WfsLayer />
    </MapContainer>
  );
};

export default LeafletMap;
