import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vite/webpack rompe los paths por defecto de Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export type MapLocation = {
  id: number;
  cliente: string;
  cedula?: string;
  telefono?: string;
  direccion?: string;
  medidor?: string | null;
  posicion: LatLngTuple;
};

const FitBounds = ({ positions }: { positions: LatLngTuple[] }) => {
  const map = useMap();
  useEffect(() => {
    if (!positions.length) return;
    if (positions.length === 1) {
      map.setView(positions[0], 15);
      return;
    }
    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
  }, [map, positions]);
  return null;
};

const FlyTo = ({ target }: { target: LatLngTuple | null }) => {
  const map = useMap();
  useEffect(() => {
    if (!target) return;
    map.flyTo(target, 16, { duration: 0.6 });
  }, [map, target]);
  return null;
};

type Props = {
  locations: MapLocation[];
  focus?: LatLngTuple | null;
  height?: number | string;
};

const DEFAULT_CENTER: LatLngTuple = [-26.6324065, -55.5191857];

export const MapComponent = ({ locations, focus = null, height = '100%' }: Props) => {
  const positions = useMemo(() => locations.map((l) => l.posicion), [locations]);

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={13}
      style={{ width: '100%', height, borderRadius: 12 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />
      <FitBounds positions={positions} />
      <FlyTo target={focus} />
      {locations.map((location) => (
        <Marker key={location.id} position={location.posicion}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <strong>{location.cliente}</strong>
              {location.cedula ? <div>CI {location.cedula}</div> : null}
              {location.telefono ? <div>Tel. {location.telefono}</div> : null}
              {location.direccion ? <div>{location.direccion}</div> : null}
              {location.medidor ? <div>Medidor {location.medidor}</div> : null}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
