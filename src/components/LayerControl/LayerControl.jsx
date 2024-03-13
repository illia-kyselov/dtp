import React from 'react';
import L from 'leaflet';
import { TileLayer, WMSTileLayer, useMap, LayersControl } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import './LayerControl.scss';

const LayerControl = () => {
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
  
  return (
    <div className="layer-control">
      <LayersControl position="topright" onLayerChange={onLayerChange}>
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Map data: © OpenStreetMap contributors'
          />
        </LayersControl.BaseLayer>
{/* 
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

        <LayersControl.Overlay name="Просторове представлення межі дороги">
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
        <LayersControl.Overlay name="WMS TEST">
          <WMSTileLayer
            layers="rus3857"
            url="http://local.mapserv/cgi-bin/mapserv?map=/var/www/mapsrv/maps/rus3857.map&layer=rus3857"
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
      </LayersControl>
      
    </div>
  );
};

export default LayerControl;
