import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import iconOn from "@/images/markers/on.png";
import iconOff from "@/images/markers/off.png";
import iconDisable from "@/images/markers/disable.png";
import { Cluster, Unit } from "@/types/Cluster";
import { RightSidebar } from "./RightSidebar";
import { LatLngExpression } from "leaflet";
import { UnitStatus, useWebSocket } from "@/contexts/WebsocketProvider";

const MapContainer = dynamic(() => import("./MapContainerWrapper"), {
  ssr: false,
});
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

interface MapProps {
  selectedUnit: Unit | null;
  handleToggleUnit: (unitID: number) => void;
  setSelectedUnit: (unit: Unit | null) => void;
  clusters: Cluster[];
}

export const Map = ({
  selectedUnit,
  handleToggleUnit,
  setSelectedUnit,
  clusters,
}: MapProps) => {
  const { unitStatus } = useWebSocket();
  const [leafletMap, setLeafletMap] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        setLeafletMap(L);
      });
    }
  }, []);

  const panToUnit = (map: any, unit: UnitStatus) => {
    if (map && unit.gps_lat && unit.gps_log) {
      map.setView([unit.gps_lat, unit.gps_log - 0.001], 22);
    }
  };

  const handleMapRef = (mapInstance: any) => {
    if (mapInstance && selectedUnit) {
      panToUnit(mapInstance, selectedUnit);
    }
  };

  const GetIcon = (
    iconSize: number,
    isConnected: boolean,
    isLightOn: boolean
  ) => {
    if (!leafletMap) return undefined; 
    const size: [number, number] = [iconSize, iconSize];
    const L = leafletMap;

    if (isConnected) {
      if (isLightOn) {
        return L.icon({ iconUrl: iconOn.src, iconSize: size });
      } else {
        return L.icon({ iconUrl: iconOff.src, iconSize: size });
      }
    } else {
      return L.icon({ iconUrl: iconDisable.src, iconSize: size });
    }
  };

  const handleMarkerClick = (unit: Unit) => {
    setSelectedUnit(unit);
  };

  return (
    <div className="flex">
      {leafletMap && (
        <MapContainer
          whenCreated={handleMapRef}
          center={[10.8231, 106.6297] as LatLngExpression}
          zoom={22}
          className="h-screen w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {Object.values(unitStatus).map((unit: any) => {
            const icon = GetIcon(30, unit.isConnected, unit.isOn);
            const unitData: Unit = {
              id: unit.id,
              latitude: unit.gps_lat,
              longitude: unit.gps_log,
              name: unit.name || "Unknown",
              mac: unit.mac || "Unknown",
            };

            return (
              <Marker
                key={unit.id}
                position={[unit.gps_lat, unit.gps_log] as LatLngExpression}
                icon={icon}
                eventHandlers={{
                  click: () => handleMarkerClick(unitData),
                }}
              />
            );
          })}
        </MapContainer>
      )}
      <RightSidebar
        selectedUnit={selectedUnit}
        handleToggleUnit={handleToggleUnit}
      />
    </div>
  );
};
