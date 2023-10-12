
  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
  
  const MapComponent = () => {
    const initialPosition = { lat: 26.63241, lng: -55.51919 }; // Coordenadas iniciales
  
    return (
      <MapContainer
        center={initialPosition}
        zoom={13}
        style={{ width: '100%', height: '400px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
  
  export default MapComponent;
  