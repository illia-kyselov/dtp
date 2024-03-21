import React, { useState, useEffect, version } from 'react';
import L from 'leaflet';
import { TileLayer, WMSTileLayer, useMap, LayersControl } from 'react-leaflet';
import { GeoJSON } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './LayerControl.scss';
import { InfoWMSTileLayer } from 'react-leaflet-infowms';

const LayerControl = ({ setFeatures }) => {
  const map = useMap();


  const onLayerChange = (event) => {
    const selectedLayer = event.layer;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer && map.hasLayer(layer)) {
        map.removeLayer(layer);
      }
    });
    selectedLayer.addTo(map);
  };

  // const onWMSLayerClick = async (event) => {
  //   console.log("WMS layer clicked", event);
  //   const { latlng } = event;
  //   console.log("Clicked at", latlng);
  //   const layers = map?.layers || [];
  //   console.log("Map layers", layers);

  //   const wmsLayer = layers.find(layer => layer instanceof WMSTileLayer);
  //   console.log(wmsLayer)
  //   if (wmsLayer) {
  //     const { data } = await wmsLayer.getFeatureInfo(latlng, {
  //       info_format: 'text/html',
  //     });

  //     handleHTMLResponse(data);
  //   }
  // };

  // const handleHTMLResponse = (htmlData) => {
  //   console.log(htmlData); 
  // };

// 1.3.0

function buildUrl(baseUrl, params) {
  const queryString = Object.keys(params)
    .map(key => `${key.toUpperCase()}=${encodeURIComponent(params[key])}`)
    .join('&');
  return `${baseUrl}?${queryString}`;
}

// WMS INFO HTML

function wmsInfo(event) {
  const startTime = performance.now(); 
  console.log('прошлая ссылка', event.url);
  console.log(event)
  const baseUrl = 'http://qgiss.local/cgi-bin/qgis_mapserv.fcgi';
  const bboxArray = event.params.bbox.split(",").map(parseFloat);
  const minLng = bboxArray[0];
  const minLat = bboxArray[1];
  const maxLng = bboxArray[2];
  const maxLat = bboxArray[3];
  
  const min = L.CRS.EPSG3857.project(L.latLng(minLat, minLng));
  const max = L.CRS.EPSG3857.project(L.latLng(maxLat, maxLng));
  
  const bboxEPSG3857 = `${min.x},${min.y},${max.x},${max.y}`;
  const params = {
    MAP: '/home/qgis/projects/profilo.qgs',
    SERVICE: event.params.service,
    VERSION: "1.3.0",
    REQUEST: event.params.request,
    BBOX: bboxEPSG3857,
    CRS: 'EPSG:3857',
    WIDTH: event.params.width,
    HEIGHT: event.params.height,
    LAYERS: event.params.layers,
    STYLES: event.params.styles,
    FORMAT: event.params.format,
    QUERY_LAYERS: event.params.query_layers,
    INFO_FORMAT: 'text/html',
    I: event.params.x,
    J: event.params.y
  };

  const newUrlString = buildUrl(baseUrl, params);
  console.log('новая ссылка', newUrlString);

  fetch(newUrlString)
    .then((response) => response.text())
    .then((response) => {
      const endTime = performance.now();
      const elapsedTime = endTime - startTime;
      console.log('Відповідь сервера', response);
      console.log('Время выполнения запроса:', elapsedTime.toFixed(1), 'мс');
      setFeatures(response);
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

// WMS INFO JSON

// function wmsInfo(event) {
//   console.log('прошлая ссылка', event.url);
//   console.log(event)
//   const baseUrl = 'http://qgiss.local/cgi-bin/qgis_mapserv.fcgi';
//   const bboxArray = event.params.bbox.split(",").map(parseFloat);
//   const minLng = bboxArray[0];
//   const minLat = bboxArray[1];
//   const maxLng = bboxArray[2];
//   const maxLat = bboxArray[3];
  
//   const min = L.CRS.EPSG3857.project(L.latLng(minLat, minLng));
//   const max = L.CRS.EPSG3857.project(L.latLng(maxLat, maxLng));
  
//   const bboxEPSG3857 = `${min.x},${min.y},${max.x},${max.y}`;
//   const params = {
//     MAP: '/home/qgis/projects/profilo.qgs',
//     SERVICE: event.params.service,
//     VERSION: "1.3.0",
//     REQUEST: event.params.request,
//     BBOX: bboxEPSG3857,
//     CRS: 'EPSG:3857',
//     WIDTH: event.params.width,
//     HEIGHT: event.params.height,
//     LAYERS: event.params.layers,
//     STYLES: event.params.styles,
//     FORMAT: event.params.format,
//     QUERY_LAYERS: event.params.query_layers,
//     INFO_FORMAT: 'application/json',
//     I: event.params.x,
//     J: event.params.y
//   };

//   const newUrlString = buildUrl(baseUrl, params);
//   console.log('новая ссылка', newUrlString);

//   fetch(newUrlString)
//     .then((response) => response.json())
//     .then((response) => {
//       console.log('Відповідь сервера', response);
//       setFeatures(response);
//     })
//     .catch((error) => {
//       console.error('Error fetching data:', error);
//     });
// }

// function wmsInfo(event) {
//   console.log('Наш запит', event);
//   console.log('прошлая ссылка', event.url);
//   // const newUrlString = modifyUrl(event.url);
//   // const newUrlString=rebuildUrlWithParams(event.url);
//   // console.log('новая ссылка',newUrlString);

//   const bboxArray = event.params.bbox.split(",").map(parseFloat);
//   const minLng = bboxArray[0];
//   const minLat = bboxArray[1];
//   const maxLng = bboxArray[2];
//   const maxLat = bboxArray[3];
  
//   const min = L.CRS.EPSG3857.project(L.latLng(minLat, minLng));
//   const max = L.CRS.EPSG3857.project(L.latLng(maxLat, maxLng));
  
//   const bboxEPSG3857 = `${min.x},${min.y},${max.x},${max.y}`;
//   const params = {
//         MAP: '/home/qgis/projects/profilo.qgs',
//         SERVICE: event.params.service,
//         VERSION: "1.3.0",
//         REQUEST: event.params.request,
//         BBOX: bboxEPSG3857,
//         CRS: 'EPSG:3857',
//         WIDTH: event.params.width,
//         HEIGHT: event.params.height,
//         LAYERS: event.params.layers,
//         STYLES: event.params.styles,
//         FORMAT: event.params.format,
//         QUERY_LAYERS: event.params.query_layers,
//         INFO_FORMAT: 'text/html',
//         I: event.params.x,
//         J: event.params.y
//       };
//       const newUrlString = buildUrl(baseUrl, params);
//   fetch(newUrlString, params)
//     .then((response) => response.json())
//     .then((response) => {
//       console.log('Відповідь сервера', response);
//       setFeatures(response.features);
//     })
//     .catch((error) => {
//       console.error('Error fetching data:', error);
//     });
// }

function rebuildUrlWithParams(url) {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.search);

  const orderedParams = new URLSearchParams();
  orderedParams.set('SERVICE', params.get('service'));
  orderedParams.set('VERSION', params.get('version'));
  orderedParams.set('REQUEST', params.get('request'));
  orderedParams.set('BBOX', params.get('bbox'));
  orderedParams.set('CRS', params.get('srs'));
  orderedParams.set('WIDTH', params.get('width'));
  orderedParams.set('HEIGHT', params.get('height'));
  orderedParams.set('LAYERS', params.get('layers'));
  orderedParams.set('STYLES', params.get('styles'));
  orderedParams.set('FORMAT', params.get('format'));
  orderedParams.set('QUERY_LAYERS', params.get('query_layers'));
  orderedParams.set('INFO_FORMAT', params.get('info_format'));
  orderedParams.set('I', params.get('x'));
  orderedParams.set('J', params.get('y'));

  const rebuiltUrl = `${parsedUrl.origin}${parsedUrl.pathname}?${orderedParams.toString()}`;
  
  return rebuiltUrl;
}

function modifyUrl(urlString) {
  const url = new URL(urlString);
  const currentVersion = url.searchParams.get("version");
  if (currentVersion && currentVersion.toUpperCase() === "1.1.1") {
    url.searchParams.set("VERSION", "1.3.0");
  }
  return url.toString();
}

function modifyUrl(urlString) {
  const url = new URL(urlString);
  url.searchParams.delete("version");
  return url.toString();
}

//   function wmsInfo(event) {
//     console.log('Наш запит', event);

//     const requestOptions = {
//         method: 'GET',
//         headers: {
//             'Accept': 'application/json',
//             'Content-Type': 'application/json',
//             'X-WMS-Version': '1.3.0'
//         },
//         mode: 'cors',
//         cache: 'default'
//     };

//     fetch(event.url, requestOptions)
//       .then((response) => response.json())
//       .then((response) => {
//         console.log('Відповідь сервера', response);
//         setFeatures(response.features);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });
// }

  // function wmsInfo(e) {
  //   console.log('Наш запит', e)
  //   fetch('http://qgiss.local/?SERVICE=WMTS&REQUEST=GetFeatureInfo&MAP=/home/qgis/projects/world.qgs&LAYER=register_rdsign&INFOFORMAT=text/html', { mode: 'no-cors' })
  //     .then((response) => response.text())
  //     .then((response) => {
  //       console.log('Відповідь сервера', response)
  //       setFeatures(response.features);
  //     })
  // }

  // function wmsInfo(event) {
  //   console.log(event)
  //   fetch('http://qgiss.local/?SERVICE=WMTS&REQUEST=GetFeatureInfo&MAP=/home/qgis/projects/world.qgs&LAYER=register_rdsign&INFOFORMAT=text/html', { mode: 'no-cors' })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       console.log(response)
  //     })
  // }

  // const [wfsData, setWfsData] = useState(null);

//   useEffect(() => {
//     fetchWfsData();
//   }, []);

//   const fetchWfsData = async () => {
//     try {
//       const wfsUrl = 'https://demo.opengeo.org/geoserver/wfs';
      
//       const layerId = 'topp:states';
      
//       const params = {
//         service: 'WFS',
//         version: '1.0.0',
//         request: 'GetFeature',
//         typeName: layerId,
//         outputFormat: 'application/json',
//       };
//       const url = `${wfsUrl}?${new URLSearchParams(params).toString()}`;
//       const response = await fetch(url);
//       const data = await response.json();
//       setWfsData(data);
//     } catch (error) {
//       console.error('Ошибка при получении данных WFS:', error);
//     }
// };

  return (
    <div className="layer-control">
      <LayersControl position="topright" onLayerChange={onLayerChange} collapsed={false}>
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Map data: © OpenStreetMap contributors'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="ArcGIS Layer">
          <TileLayer
            url="https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png"
            attribution='Map data: © МІСЬКА СХЕМА ОРГАНІЗАЦІЇ ДОРОЖНЬОГО РУХУ'
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="100.000 України">
          <TileLayer
            url="http://192.168.1.5:3001/map/rtile/carto_3095100847655224519/ua/{z}/{x}/{y}.png"
            attribution='Map data: © МІСЬКА СХЕМА ОРГАНІЗАЦІЇ ДОРОЖНЬОГО РУХУ'
          />
        </LayersControl.BaseLayer>

        {/* <LayersControl.Overlay name="Просторове представлення межі дороги">
          <TileLayer
            url="http://192.168.1.5:3001/map/rtile/carto_3311781629541746007/ua/{z}/{x}/{y}.png"
            attribution='Map data: © МІСЬКА СХЕМА ОРГАНІЗАЦІЇ ДОРОЖНЬОГО РУХУ'
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Поперчний профіль">
          <TileLayer
            url="http://192.168.1.5:3001/map/rtile/carto_3311785568152585577/ua/{z}/{x}/{y}.png"
            attribution='Map data: © МІСЬКА СХЕМА ОРГАНІЗАЦІЇ ДОРОЖНЬОГО РУХУ'
          />
        </LayersControl.Overlay> */}
        <LayersControl.Overlay name="TEST TSM CACHE">
          <TileLayer
            url="http://local.mapserv/mapcache/tms/1.0.0/rus3857@my/{z}/{x}/{y}.png"
            attribution='Map data: © МІСЬКА СХЕМА ОРГАНІЗАЦІЇ ДОРОЖНЬОГО РУХУ'
            crs={L.CRS.EPSG3857}
          />
          {/* <TileLayer
                url="http://local.mapserv/mapcache/tms/1.0.0/rus3857@my/{z}/{x}/{y}.png"
                attribution='Map data: © МІСЬКА СХЕМА ОРГАНІЗАЦІЇ ДОРОЖНЬОГО РУХУ'
                maxZoom={13}
                tileSize={256}
                zoomOffset={0}
                tms={true}
                continuousWorld={true}
                bounds={[[3405194.387, 6521101.878], [3409934.445, 6525854.965]]}
                crs={L.CRS.EPSG3857}
              /> */}
        </LayersControl.Overlay>
        {/* <LayersControl.Overlay name="WMS Layer">
          <WMSTileLayer
            layers="rus9864"
            url="http://192.168.1.8/cgi-bin/mapserv?map=/var/www/mapsrv/maps/rus9864.map&layer=rus9864"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="WMS TEST_roads">
          <WMSTileLayer
            layers="cross_prof"
            url="http://mapss.local/cgi-bin/mapserv?map=/var/www/mapsrv/maps/roads.map&layer=cross_prof"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
            maxZoom={20}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="WMS Layer">
          <WMSTileLayer
            layers="JorgeAlv:TEST"
            url="https://wms.prod.qgiscloud.com/ProcemSIG/Capturas_Mosca_semana_28/"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="WMS board_obj">
          <WMSTileLayer
            layers="board_obj"
            url="http://mapss.local/cgi-bin/mapserv?map=/var/www/mapsrv/maps/roads.map&layer=board_obj"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
            maxZoom={20}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="new road test">
          <WMSTileLayer
            layers="road_models_coord"
            url="http://mapss.local/cgi-bin/mapserv?map=/var/www/mapsrv/maps/roads.map&layer=road_models_coord"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
            maxZoom={20}
          />
        </LayersControl.Overlay> */}
        <LayersControl.Overlay name="QGIS.S register_rdsign">
          <InfoWMSTileLayer
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo.qgs"
            params={{
              layers: "register_rdsign",
              format: 'image/png',
              transparent: true,
              attribution: 'Map data: © QGIS Cloud',
              maxZoom: 20,
              feature_count: 1,
            }}
            eventHandlers={{ click: (event) => wmsInfo(event) }}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="QGIS.S road_models_coord.geom">
          <InfoWMSTileLayer
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo.qgs"
            params={{
              layers: "road_models_coord.geom",
              format: 'image/png',
              transparent: true,
              attribution: 'Map data: © QGIS Cloud',
              maxZoom: 20,
              feature_count: 1,
            }}
            eventHandlers={{ click: (event) => wmsInfo(event) }}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="QGIS.S cross_prof_obj.geom_wgs">
          <InfoWMSTileLayer
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo.qgs"
            params={{
              layers: "cross_prof_obj.geom_wgs",
              format: 'image/png',
              transparent: true,
              attribution: 'Map data: © QGIS Cloud',
              maxZoom: 20,
              feature_count: 1,
            }}
            eventHandlers={{ click: (event) => wmsInfo(event) }}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="QGIS.S board_road_obj.geom_wgs">
          <InfoWMSTileLayer
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo.qgs"
            params={{
              layers: "board_road_obj.geom_wgs",
              format: 'image/png',
              transparent: true,
              attribution: 'Map data: © QGIS Cloud',
              maxZoom: 20,
              feature_count: 1,
            }}
            eventHandlers={{ click: (event) => wmsInfo(event) }}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="QGIS SERVER WMS">
          <InfoWMSTileLayer
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo_.qgs"
            params={{
              layers: "all_road_obj",
              version:'1.3.0',
              format: 'image/png',
              transparent: true,
              attribution: 'Map data: © QGIS Cloud',
              maxZoom: 20,
              feature_count: 1,
            }}
            eventHandlers={{ click: (event) => wmsInfo(event) }}
          />
        </LayersControl.Overlay>
        {/* <LayersControl.Overlay name="QGIS.S road_models_coord.geom">
          <WMSTileLayer
            layers="road_models_coord.geom"            
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo.qgs"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
            maxZoom={20}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="QGIS.S cross_prof_obj.geom_wgs">
          <WMSTileLayer
            layers="cross_prof_obj.geom_wgs"
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo.qgs"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
            maxZoom={20}
          />
        </LayersControl.Overlay>
        <LayersControl.Overlay name="QGIS.S board_road_obj.geom_wgs">
          <WMSTileLayer
            layers="board_road_obj.geom_wgs"
            url="http://qgiss.local/cgi-bin/qgis_mapserv.fcgi?MAP=/home/qgis/projects/profilo.qgs"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
            maxZoom={20}
          />
        </LayersControl.Overlay> */}
        {/* <LayersControl.Overlay name="TEST WMS DATA">
          <InfoWMSTileLayer
            url='https://public-mapservice.lf.goteborg.se/geoserver/LF_Externwebb/wms?'
            params={{
              layers: 'Utrustning',
              format: 'image/png',
              transparent: true,
              attribution: 'Public Geoserver LF Goteborg City',
              feature_count: 1,
            }}
            eventHandlers={{ click: (event) => wmsInfo(event) }}
          />
        </LayersControl.Overlay> */}
        {/* <LayersControl.Overlay name="WFS Layer">
          <GeoJSON
            data={wfsData}
            style={() => ({
              color: 'blue',
              weight: 2,
              fillColor: 'lightblue',
              fillOpacity: 0.5,
            })}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: () => handleFeatureClick(feature),
              });
            }}
          />
        </LayersControl.Overlay> */}

      <LayersControl.Overlay name="MAPCACHE WMS">
          <WMSTileLayer
            layers="all_road_obj"
            version='1.3.0'
            url="http://mapss.local/cache_qgiss"
            format="image/png"
            transparent={true}
            attribution='Map data: © QGIS Cloud'
            maxZoom={20}
            
          />
        </LayersControl.Overlay>
      </LayersControl>
    </div>
  );
};

export default LayerControl;
