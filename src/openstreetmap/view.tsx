import * as React from 'react';
import type { ApiRequestor, Table } from 'pa-typings';
import * as opencage from 'opencage-api-client';
import { MapContainer, TileLayer, Marker, AttributionControl, useMapEvents } from 'react-leaflet';
import {Icon} from 'leaflet';

import './styles.css';
import 'leaflet/dist/leaflet.css';

interface Props {
  requestor: ApiRequestor;
  width?: number;
  height?: number;
  isEditor: boolean;
  setAppearance: (appr: Record<string, any>) => void;
  getApprValue: (key: string) => ApprValue | undefined;
}

export const OpenStreetMap: React.FC<Props> = (props) => {
  const { requestor, width, height, setAppearance, getApprValue: getApprValue, isEditor } = props;

  const zoom = React.useRef(getApprValue('zoom') || 8);
  const mapRef = React.useRef<any>(null);
  const [error, setError] = React.useState< string>('');

  const wrapperGuid = React.useRef<{ wrapperGuid: string }>({ wrapperGuid: '' });
  const [position, setPosition] = React.useState<[number, number]>([39.1670396, -86.5342881]);
  const [showMarker, setShowMarker] = React.useState(false);

  const apiKey = getApprValue('apiKey') as string;
  const getGeocode = (query: string) => {
    opencage.geocode({ key: apiKey, q: query})
      .then((res) => {
        if (res.results.length && mapRef.current) {
          const {lat, lng} = res.results[0].geometry;
          setPosition([lat, lng]);
          mapRef.current.setView([lat, lng]);
          setShowMarker(true);
        }
      })
      .catch(console.log);
  };

  React.useEffect(() => {
    if (mapRef.current)
      mapRef.current.invalidateSize();
  }, [width, height]);

  React.useEffect(() => {
    const fetchData = async () => {
      let guid = wrapperGuid.current = await requestor.wrapperGuid();
      let dsInfo = await requestor.info(guid);
      const column = dsInfo.columns.find(c => c.type === 'String');
      if (!column)
        return;

      guid = await requestor.distinct({ columnId: column.id, wrapperGuid: guid.wrapperGuid }).wrapperGuid();
      dsInfo = await requestor.info(guid);

      setError(dsInfo.rowCount ? '' : 'No data to display');
      if (dsInfo.rowCount) {
        const values = await requestor.values({
          offset: 0,
          rowCount: dsInfo.rowCount,
          wrapperGuid: guid.wrapperGuid
        });
        const correctData = values.table?.length == 1;
        if (correctData) {
          const city = values.table![0][0].toString();
          getGeocode(city);
        } else {
          setShowMarker(false);
        }
      }
    };
    fetchData();

  }, [requestor]);

  const icon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  if (error)
    return <div style={{ width: `${width}px`, height: `${height}px` }} className='flex-center'>{error}</div>;

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className='main'>
      <MapContainer ref={mapRef} center={position} zoom={zoom.current}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {isEditor ? <SaveZoom setZoom={setAppearance} /> : null}
        <TileLayer attribution='' url='https://{s}.tile.osm.org/{z}/{x}/{y}.png' />
        <AttributionControl position='bottomright' prefix={false} />
        {showMarker && <Marker position={position} icon={icon} />}
      </MapContainer>
    </div>
  );
}

export const SaveZoom: React.FC<{ setZoom: (appr: Record<string, any>) => void }> = (props) => {
  const mapEvents = useMapEvents({
      zoomend: () => props.setZoom({ zoom: mapEvents.getZoom() })
  });

  return null;
}
