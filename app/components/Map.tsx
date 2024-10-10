import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import { useState } from 'react';
import L, { LatLngExpression } from 'leaflet';
import { Tooltip } from 'react-leaflet';
import { District } from '../types/lightTypes';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // Importing your dialog component
import iconOn from '@/images/markers/on.png';
import iconOff from '@/images/markers/off.png';
import iconDisable from '@/images/markers/disable.png';
import { Button } from '@/components/ui/button';

interface MapProps {
  districts: District[];
  handleToggleLight: (districtId: string, lightId: string) => void;
  handleSelectLight: (lightId: string) => void; // To pass selected light info
}

function GetIcon(iconSize: number, isConnected: boolean, isLightOn: boolean) {
  const size: [number, number] = [iconSize, iconSize];
  if (isConnected) {
    return L.icon({ iconUrl: isLightOn ? iconOn.src : iconOff.src, iconSize: size });
  } else {
    return L.icon({ iconUrl: iconDisable.src, iconSize: size });
  }
}

export const Map = ({ districts, handleToggleLight, handleSelectLight }: MapProps) => {
  const [selectedLight, setSelectedLight] = useState<string | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false); // Dialog state
  const [dialogLight, setDialogLight] = useState<{ districtId: string, lightId: string } | null>(null); // Light info for the dialog

  const handleMarkerClick = (districtId: string, lightId: string) => {
    if (selectedLight === lightId) {
      // Open dialog to confirm toggle
      setDialogOpen(true);
      setDialogLight({ districtId, lightId });
    } else {
      // Select the light
      setSelectedLight(lightId);
      handleSelectLight(lightId); // Pass selected light info
    }
  };

  const confirmToggle = () => {
    if (dialogLight) {
      handleToggleLight(dialogLight.districtId, dialogLight.lightId);
    }
    setDialogOpen(false);
  };

  return (
    <>
      <MapContainer center={[10.8231, 106.6297] as LatLngExpression} zoom={22} className="h-screen w-screen">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {districts.flatMap((district) =>
          district.lightBulbs.map((light) => (
            <Marker
              key={light.id}
              position={[light.lat, light.lng] as LatLngExpression}
              eventHandlers={{
                click: () => handleMarkerClick(district.id, light.id),
              }}
              icon={GetIcon(30, light.isConnected, light.isOn)}
            >
              <Tooltip>
                {light.isConnected ? `${light.name} is ${light.isOn ? 'On' : 'Off'}` : `${light.name} is disabled`}
              </Tooltip>
            </Marker>
          ))
        )}
      </MapContainer>

      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
            <p>Are you sure you want to {dialogLight && districts
              .flatMap(d => d.lightBulbs)
              .find(l => l.id === dialogLight.lightId)?.isOn ? 'turn off' : 'turn on'} this light?</p>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="secondary">Cancel</Button>
            <Button onClick={confirmToggle} variant="default">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
