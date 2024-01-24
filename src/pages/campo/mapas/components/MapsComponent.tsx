import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
    center: number[];
    zoom: number;
}

const ChangeView = ({ center, zoom }: MapProps) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

interface MapComponentProps {
    locations: {cliente:string, posicion:[number,number]}[];
}

export const MapComponent = ({ locations }: MapComponentProps) => {
    const initialPosition = [ -26.6324065, -55.51918569999999]; // Coordenadas iniciales

    return (
        <MapContainer
            style={{ width: '100%', height: '400px' }} 
        >
            <ChangeView center={initialPosition} zoom={13} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                //@ts-ignore
                attribution='&amp;copy AdrianCM'
            />
            {locations.map((location, index) => (
                <Marker key={index} position={location.posicion}>
                    <Popup>
                        <div>
                            <h2>Cliente: {location.cliente}</h2>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};