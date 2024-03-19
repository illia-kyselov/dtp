import React from 'react';
import { useMap } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';

const WfsLayer = () => {
  const map = useMap();

  const handleWfsFeatureClick = (event) => {
    const layer = event.target;
    layer.bindPopup((layer) => {
      let html = "<h3>info</h3>";
      for (var key in layer.feature.properties) {
        if (layer.feature.properties.hasOwnProperty(key)) {
          html += `<p><strong>${key}</strong>: ${layer.feature.properties[key]}</p>`;
        }
      }
      return html;
    }).openPopup();
  };

  const wfsLayerOptions = {
    url: 'https://geoserver.geoplatform.gov/geoserver/wfs',
    params: {
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      typeName: 'ngda:0e3763a7_2f60_4c70_a937_858c821a4ea0',
      outputFormat: 'application/json',
    },
    eventHandlers: {
      click: handleWfsFeatureClick,
    },
  };

  return <GeoJSON {...wfsLayerOptions} />;
};

export default WfsLayer;
