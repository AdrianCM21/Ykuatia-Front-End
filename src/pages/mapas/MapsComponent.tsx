import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
interface MapProps {
    center: number[];
    zoom: number;

}

const ChangeView = ({ center, zoom }:MapProps) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

export const MapComponent = () => {
    const initialPosition = [ -26.6324065, -55.51918569999999]; // Coordenadas iniciales

    return (
        <MapContainer
            style={{ width: '100%', height: '400px' }} 
        >
            <ChangeView center={initialPosition} zoom={13} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&amp;copy AdrianCM'

            />
            <Marker position={initialPosition}>
                <Popup>
                    {/* Puedes agregar contenido personalizado dentro del Popup */}
                    <div>
                        <h2>Lugar de Interés</h2>
                        <p>Esta es una ubicación importante</p>
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

