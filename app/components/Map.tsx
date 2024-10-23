import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import iconOn from "@/images/markers/on.png";
import iconOff from "@/images/markers/off.png";
import iconDisable from "@/images/markers/disable.png";
import { Cluster, Unit } from "@/types/Cluster";
import { RightSidebar } from "./RightSidebar";
import { LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useWebSocket } from "@/contexts/WebsocketProvider";
import L from "leaflet"; // Import leaflet directly

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
  const mapRef = useRef<L.Map | null>(null);
  const { unitStatus } = useWebSocket();
  useEffect(() => {
    if (mapRef.current && selectedUnit) {
      if (selectedUnit.latitude && selectedUnit.longitude) {
        mapRef.current.setView(
          [selectedUnit.latitude, selectedUnit.longitude - 0.001], // Latitude first
          22
        );
      }
    }
  }, [selectedUnit]);

  const GetIcon = (
    iconSize: number,
    isConnected: boolean,
    isLightOn: boolean,
    unitName: string
  ) => {
    let iconUrl = "";

    if (isConnected) {
      iconUrl = isLightOn ? iconOn.src : iconOff.src;
    } else {
      iconUrl = iconDisable.src;
    }

    // Create an HTML-based icon using L.divIcon
    return L.divIcon({
      html: `
        <div style="display: flex; align-items: center; justify-content: center; text-align: center;">
        <img src="${iconUrl}" style="width: ${iconSize}px; height: ${iconSize}px;" />
        <span style="font-size: 12px; background: rgba(255, 255, 255, 0.8); padding: 2px 4px; border-radius: 4px; margin-left: 8px;">
          ${unitName}
        </span>
      </div>
      `,
      iconSize: [iconSize, iconSize],
      className: "custom-leaflet-icon",
    });
  };

  const getMarker = (unit: Unit, status: any) => {
    const unitData: Unit = {
      id: unit.id,
      latitude: unit.latitude,
      longitude: unit.longitude,
      name: unit.name || "Unknown",
      mac: unit.mac || "Unknown",
    };

    const icon = GetIcon(25, status.isConnected, status.isOn, unitData.name);

    return (
      <Marker
        key={unit.id}
        position={[unitData.latitude, unitData.longitude] as LatLngExpression}
        icon={icon}
        eventHandlers={{
          click: () => setSelectedUnit(unitData),
        }}
      />
    );
  };

  return (
    <div className="flex">
      <MapContainer
        ref={mapRef}
        center={[10.8231, 106.6297] as LatLngExpression}
        zoom={22}
        className="h-screen w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {selectedUnit &&
          unitStatus &&
          getMarker(selectedUnit, unitStatus[selectedUnit.id])}
      </MapContainer>
      <RightSidebar
        selectedUnit={selectedUnit}
        handleToggleUnit={handleToggleUnit}
      />
    </div>
  );
};
