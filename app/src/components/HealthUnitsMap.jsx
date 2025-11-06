import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import Service from '../utils/service/Service'

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
            map.flyTo(position, 13); // Centraliza e dá zoom
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

    // 1. Obter a localização do usuário (Exemplo com Geolocation API - mais comum)
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

    // 2. Buscar postos de saúde no OpenDataSUS
    useEffect(() => {
        const fetchHealthUnits = async (lat, lon) => {
            const API_URL = "https://apidadosabertos.saude.gov.br/cnes/estabelecimentos";
            const distance = 70;
            
            // NOTE: A API do OpenDataSUS /cnes/estabelecimentos não suporta diretamente busca por raio (lat/lon)
            // A API exige parâmetros como 'uf', 'municipio', 'tipoUnidade', etc. 
            // Para um projeto real com busca por geolocalização, você precisará de:
            // a) Uma API de geocodificação reversa (ex: IBGE, Google) para descobrir o município/UF a partir da lat/lon.
            // b) Uma API de terceiros ou um backend que filtre os dados do OpenDataSUS por raio.
            
            // Aqui, faremos uma simulação de busca, **assumindo que você usará um backend**
            // ou outra estratégia, ou usará um endpoint que suporta busca geográfica (se existir um novo).
            
            // EXEMPLO SIMPLIFICADO: Busca em um município fixo para demonstração, já que a API não aceita lat/lon diretamente.
            // *VOCÊ DEVE AJUSTAR ISSO PARA UM CENÁRIO REAL.*
            
            try {
                const res = await service.getWithParams("/mapa/uf_municipio", {latitude: userLocation[0], longitude: userLocation[1]})
            } catch (err) {
                console.log("erro ao transformar coordenas em uf e municipio ", err)
            }a
        };

        if (userLocation) {
            fetchHealthUnits(userLocation[0], userLocation[1]);
        }
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