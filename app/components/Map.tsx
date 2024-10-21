import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import iconOn from "@/images/markers/on.png";
import iconOff from "@/images/markers/off.png";
import iconDisable from "@/images/markers/disable.png";
import { Cluster, Unit } from "@/types/Cluster";
import { RightSidebar } from "./RightSidebar";
import { LatLngExpression } from "leaflet";

// Dynamically import react-leaflet components to avoid SSR issues
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
  const [unitStatus, setUnitStatus] = useState<
    Record<number, { isOn: boolean; isConnected: boolean }>
  >({});

  const [leafletMap, setLeafletMap] = useState<typeof import("leaflet") | null>(
    null
  );

  useEffect(() => {
    // Dynamically import Leaflet on the client side
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        setLeafletMap(L);
      });
    }
  }, []);

  const panToUnit = (map: any, unit: Unit) => {
    if (map && unit.latitude && unit.longitude) {
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

  // Use a callback ref to get access to the map instance
  const handleMapRef = (mapInstance: any) => {
    if (mapInstance && selectedUnit) {
      panToUnit(mapInstance, selectedUnit);
      const cleanup = initializeWebSocket(selectedUnit.id);
      return () => {
        if (cleanup) cleanup();
      };
    }
  };

  // Ensure that any code relying on Leaflet is only executed on the client
  const GetIcon = (
    iconSize: number,
    isConnected: boolean,
    isLightOn: boolean
  ) => {
    if (!leafletMap) return undefined; // Ensure Leaflet is loaded
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

  return (
    <div className="flex">
      {leafletMap && (
        <MapContainer
          whenCreated={handleMapRef} // Use this callback instead of ref to get the map instance
          center={[10.8231, 106.6297] as LatLngExpression}
          zoom={22}
          className="h-screen w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {clusters.length > 0 &&
            clusters.flatMap((cluster) =>
              cluster.units.filter(
                (unit) => unit.latitude && unit.longitude
              ).map((unit) => {
                const status = unitStatus[unit.id] || {
                  isOn: false,
                  isConnected: false,
                };
                const icon = GetIcon(30, status.isConnected, status.isOn);
                return (
                  <Marker
                    key={unit.id}
                    position={
                      [unit.latitude, unit.longitude] as LatLngExpression
                    }
                    icon={icon}
                    eventHandlers={{
                      click: () => setSelectedUnit(unit),
                    }}
                  />
                );
              })
            )}
        </MapContainer>
      )}
      <RightSidebar
        selectedUnit={selectedUnit}
        handleToggleUnit={handleToggleUnit}
      />
    </div>
  );
};
