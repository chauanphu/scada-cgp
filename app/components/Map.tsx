import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import Cookies from "js-cookie";
import iconOn from "@/images/markers/on.png";
import iconOff from "@/images/markers/off.png";
import iconDisable from "@/images/markers/disable.png";
import { Cluster, Unit } from "@/types/Cluster";
import { RightSidebar } from "./RightSidebar";

// Dynamically import react-leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

interface MapProps {
  selectedUnit: Unit | null;
  handleToggleUnit: (unitID: number) => void;
  setSelectedUnit: (unit: Unit | null) => void;
  clusters: Cluster[];
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

export const Map = ({
  selectedUnit,
  handleToggleUnit,
  setSelectedUnit,
  clusters,
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [unitStatus, setUnitStatus] = useState<
    Record<number, { isOn: boolean; isConnected: boolean }>
  >({});

  const panToUnit = (unit: Unit) => {
    if (mapRef.current) {
      const map = mapRef.current as L.Map;
      if (unit.latitude && unit.longitude)
      map.setView([unit.latitude, unit.longitude - 0.001], 22);
    }
  };

  const initializeWebSocket = (unitId: number) => {
    const ws = new WebSocket(
      `ws://api.cgp.captechvn.com/ws/unit/${unitId}/status`
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const isConnected = data.power !== 0;
      const isOn = data.toggle === 1;

      setUnitStatus((prevState) => ({
        ...prevState,
        [unitId]: { isOn, isConnected },
      }));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (ws) {
        ws.close();
      }
    };
  };

  useEffect(() => {
    if (selectedUnit) {
      panToUnit(selectedUnit);
      const cleanup = initializeWebSocket(selectedUnit.id);
      return () => {
        if (cleanup) cleanup();
      };
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
        {clusters.length > 0 &&
          clusters.flatMap((cluster) =>
            cluster.units.map((unit) => {
              const status = unitStatus[unit.id] || {
                isOn: false,
                isConnected: false,
              };
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
