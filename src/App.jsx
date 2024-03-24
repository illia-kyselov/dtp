import React, { useState, useEffect } from 'react';
import './App.css';
import LeafletMap from './components/LeafletMap/LeafletMap';
import Info from './components/Info';

const App = () => {
  const mapCenter = [50.4501, 30.5234];
  const mapZoom = 12;
  const [features, setFeatures] = useState([])

  useEffect(() => {
    const mapServer = [
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1252344.2714243277,7827151.696402045,1408887.3053523689,7983694.73033009',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1330615.7883883484,7827151.696402045,1408887.3053523689,7905423.213366073',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1330615.7883883484,7866287.45488406,1369751.5468703588,7905423.213366073',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1330615.7883883484,7905423.213366073,1350183.6676293535,7924991.092607074',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1330615.7883883484,7895639.273745567,1340399.728008851,7905423.213366073',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1328169.8034832226,7896862.266198133,1329392.7959357854,7898085.258650693',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1325723.818578097,7898085.258650693,1328169.8034832226,7900531.243555822',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1325723.818578097,7890747.3039353145,1330615.7883883484,7895639.273745567',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1328169.8034832226,7898085.258650693,1328781.299709504,7898696.754876974',
      'https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?&service=WMS&request=GetMap&layers=Utrustning&styles=&format=image%2Fpng&transparent=true&version=1.1.1&width=256&height=256&srs=EPSG%3A3857&bbox=1327864.0553700821,7898238.132707261,1328016.9294266524,7898391.006763836',
    ];

    const fetchAndCalculateStatistics = async (urls, repetitions) => {
      const responseTimes = [];

      const fetchData = async (url) => {
        const startTime = performance.now();
        const response = await fetch(url);
        const endTime = performance.now();
        const elapsedTime = endTime - startTime;
        responseTimes.push(elapsedTime);
      };

      for (const url of urls) {
        for (let i = 0; i < repetitions; i++) {
          await fetchData(url);
        }
      }

      const minTime = Math.min(...responseTimes);
      const maxTime = Math.max(...responseTimes);
      const sum = responseTimes.reduce((acc, curr) => acc + curr, 0);
      const avgTime = sum / responseTimes.length;

      console.log('Minimum Time:', minTime.toFixed(2), 'milliseconds');
      console.log('Maximum Time:', maxTime.toFixed(2), 'milliseconds');
      console.log('Average Time:', avgTime.toFixed(2), 'milliseconds');
    };

    const repetitions = 100;
    fetchAndCalculateStatistics(mapServer, repetitions);
  }, []);

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
