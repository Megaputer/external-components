import * as React from 'react';
import type { ApiRequestor, ApprValue } from 'pa-typings';
import * as opencage from 'opencage-api-client';
import { MapContainer, TileLayer, Marker, AttributionControl, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';

import './styles.css';
import 'leaflet/dist/leaflet.css';

import MarkerIcon from 'leaflet/dist/images/marker-icon.png';

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

  const updateMarker = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    mapRef.current.setView([lat, lng]);
    setShowMarker(true);
  };

  const apiKey = getApprValue('apiKey') as string;
  const getGeocode = (query: string) => {
    opencage.geocode({ key: apiKey, q: query })
      .then((res) => {
        if (res.results.length && mapRef.current) {
          const { lat, lng } = res.results[0].geometry;
          updateMarker(lat, lng);
        }
      })
      .catch(console.log);
  };

  const showMarkerByAddress = (data: (number | string)[]) => {
    const id = getApprValue('address')!;
    if (id === '')
      return;
    const city = data[+id].toString();
    getGeocode(city);
  };

  const showMarkerByCoordinate = (data: (number | string)[]) => {
    const latColId = getApprValue('latitude')!;
    const lngColId = getApprValue('longitude')!;
    if (latColId === '' || lngColId === '')
      return;
    const lat = data[+latColId] as number;
    const lng = data[+lngColId] as number;
    updateMarker(lat, lng);
  };

  React.useEffect(() => {
    if (mapRef.current)
      mapRef.current.invalidateSize();
  }, [width, height]);

  React.useEffect(() => {
    const fetchData = async () => {
      const guid = wrapperGuid.current = await requestor.wrapperGuid();
      const dsInfo = await requestor.info(guid);

      setError(dsInfo.rowCount ? '' : 'No data to display');
      if (dsInfo.rowCount) {
        const values = await requestor.values({
          offset: 0,
          rowCount: dsInfo.rowCount,
          wrapperGuid: guid.wrapperGuid
        });

        if (values.table?.length == 1) {
          const [data = []] = values.table || [];
          if (!data.length)
            return;

          'address' === getApprValue('mode') ? showMarkerByAddress(data) : showMarkerByCoordinate(data);
        } else {
          setShowMarker(false);
        }
      }
    };
    fetchData();
  }, [requestor]);

  const icon = new Icon({
    iconUrl: MarkerIcon,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  });

  if (error)
    return <div style={{ width: `${width}px`, height: `${height}px` }} className='flex-center'>{error}</div>;

  return (
    <div style={{ width: `${width}px`, height: `${height}px` }} className='main'>
      <MapContainer
        ref={mapRef}
        center={position}
        zoom={zoom.current}
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
};

export const SaveZoom: React.FC<{ setZoom: (appr: Record<string, any>) => void }> = (props) => {
  const mapEvents = useMapEvents({
    zoomend: () => props.setZoom({ zoom: mapEvents.getZoom() })
  });

  return null;
};
