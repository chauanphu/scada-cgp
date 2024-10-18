import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Cookies from 'js-cookie';
import iconOn from "@/images/markers/on.png";
import iconOff from "@/images/markers/off.png";
import iconDisable from "@/images/markers/disable.png";
import { Cluster, Unit } from '@/types/Cluster'; 
import { RightSidebar } from './RightSidebar';
interface MapProps {
  selectedUnit: Unit | null;
  handleToggleUnit: (unitID: number) => void;
  setSelectedUnit: (unit: Unit | null) => void;
}

function GetIcon(iconSize: number, isConnected: boolean, isLightOn: boolean) {
  const size: [number, number] = [iconSize, iconSize];

  if (isConnected) {
    if (isLightOn) {
      return L.icon({ iconUrl: iconOn.src, iconSize: size });
    } else {
      return L.icon({ iconUrl: iconOff.src, iconSize: size });
    }
  } else {
    return L.icon({ iconUrl: iconDisable.src, iconSize: size });
  }
}

export const Map = ({ selectedUnit, handleToggleUnit, setSelectedUnit }: MapProps) => {
  const mapRef = useRef(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [unitStatus, setUnitStatus] = useState<Record<number, { isOn: boolean, isConnected: boolean }>>({});

  const fetchClusters = async () => {
    const token = Cookies.get('token');
    const response = await fetch('/api/clusters/my-clusters', {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setClusters(data);
  };

  const panToUnit = (unit: Unit) => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView([unit.latitude, unit.longitude - 0.001], 22);
    }
  };

  const initializeWebSocket = (unitId: number) => {
    const ws = new WebSocket(`ws://api.cgp.captechvn.com/ws/unit/${unitId}/status`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const isConnected = data.power !== 0;
      const isOn = data.toggle === 1;

      setUnitStatus(prevState => ({
        ...prevState,
        [unitId]: { isOn, isConnected },
      }));
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      panToUnit(selectedUnit);
      initializeWebSocket(selectedUnit.id);
    }
  }, [selectedUnit]);

  return (
    <div className="flex">
      <MapContainer
        ref={mapRef}
        center={[10.8231, 106.6297] as LatLngExpression}
        zoom={22}
        className="h-screen w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {clusters.flatMap(cluster =>
          cluster.units.map(unit => {
            const status = unitStatus[unit.id] || { isOn: false, isConnected: false };
            const icon = GetIcon(30, status.isConnected, status.isOn);
            return (
              <Marker
                key={unit.id}
                position={[unit.latitude, unit.longitude] as LatLngExpression}
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedUnit(unit),
                }}
              />
            );
          })
        )}
      </MapContainer>
      <RightSidebar
                selectedUnit={selectedUnit}
                handleToggleUnit={handleToggleUnit}
            />
    </div>
  );
};
