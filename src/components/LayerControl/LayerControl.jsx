import React from 'react';
import L from 'leaflet';
import { TileLayer, WMSTileLayer, useMap, LayersControl } from 'react-leaflet';

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

  function wmsInfo(event) {
    console.log('Наш запит', event)
    fetch(event.url)
      .then((response) => response.json())
      .then((response) => {
        console.log('Відповідь сервера', response)
        setFeatures(response.features)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }
  

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
    
  return (
    <div className="layer-control">
      <LayersControl position="topright" onLayerChange={onLayerChange}>
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
        </LayersControl.Overlay> */}
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
        </LayersControl.Overlay>
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
        <LayersControl.Overlay name="TEST WMS DATA">
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
        </LayersControl.Overlay>
      </LayersControl>
      
    </div>
  );
};

export default LayerControl;
