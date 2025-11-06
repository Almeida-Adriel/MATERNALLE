import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Service from '../utils/service/Service';

const service = new Service();

// Corrige o problema do ícone padrão do Leaflet no Webpack/React
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente interno para centralizar o mapa na localização do usuário
function LocationMarker({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 13);
        }
    }, [map, position]);
    return position === null ? null : (
        <Marker position={position}>
            <Popup>Você está aqui!</Popup>
        </Marker>
    );
}

const HealthUnitsMap = () => {
    // Estado para a localização do usuário (latitude e longitude)
    const [userLocation, setUserLocation] = useState(null);
    // Estado para os postos de saúde
    const [healthUnits, setHealthUnits] = useState([]);
    // Estado para o erro
    const [error, setError] = useState(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation([pos.coords.latitude, pos.coords.longitude]);
                },
                (err) => {
                    console.error("Erro ao obter localização: ", err);
                    setError("Não foi possível obter a localização do usuário. Verifique as permissões.");
                }
            );
        } else {
            setError("Geolocalização não é suportada por este navegador.");
        }
    }, []);

    useEffect(() => {
        const fetchHealthUnits = async () => {
            if (!userLocation) return;

            // Busca a UF e o Município a partir das coordenadas (latitude, longitude)
            const { uf, municipio } = await buscarUfEMunicipio(userLocation[0], userLocation[1]);

            if (uf && municipio) {
                try {
                    // Aqui, você passa os parâmetros de UF e Município para a API do OpenDataSUS
                    const res = await service.getWithParams("/cnes/estabelecimentos", { uf, municipio });
                    setHealthUnits(res); // Define os postos de saúde no estado
                } catch (err) {
                    console.error("Erro ao buscar postos de saúde:", err);
                    setError("Não foi possível buscar os postos de saúde.");
                }
            } else {
                setError("Não foi possível determinar a UF ou o Município.");
            }
        };

        fetchHealthUnits();
    }, [userLocation]);

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;
    }

    if (!userLocation) {
        return <div style={{ padding: '20px' }}>Carregando localização...</div>;
    }

    // Posição inicial (pode ser a localização do usuário ou um padrão antes do flyTo)
    const initialPosition = userLocation; 

    return (
        <MapContainer 
            center={initialPosition} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Marcador da Localização do Usuário e centralização */}
            <LocationMarker position={userLocation} />

            {/* Marcadores dos Postos de Saúde */}
            {healthUnits.map(unit => (
                <Marker key={unit.id} position={[unit.lat, unit.lon]}>
                    <Popup>
                        **{unit.nome}**
                        <br />
                        Tipo: {unit.tipo}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default HealthUnitsMap;