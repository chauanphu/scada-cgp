import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { District } from '../types/lightTypes';
import iconOn from '@/images/markers/on.png';
import iconOff from '@/images/markers/off.png';
import iconDisable from '@/images/markers/disable.png';

interface MapProps {
    districts: District[];
    handleToggleLight: (districtId: string, lightId: string) => void;
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

export const Map = ({ districts, handleToggleLight }: MapProps) => {
    return (
        <MapContainer
            center={[10.8231, 106.6297] as LatLngExpression}
            zoom={22}
            className='h-screen w-screen'
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {districts.flatMap((district) =>
                district.lightBulbs.map((light) => (
                    <Marker
                        key={light.id}
                        position={[light.lat, light.lng] as LatLngExpression}
                        eventHandlers={{
                            click: () => light.isConnected && handleToggleLight(district.id, light.id),
                        }}
                        icon={GetIcon(30, light.isConnected, light.isOn)}
                    >
                        <Tooltip>
                            {light.isConnected
                                ? `${light.name} is ${light.isOn ? 'On' : 'Off'}`
                                : `${light.name} is disabled`}
                        </Tooltip>
                    </Marker>
                ))
            )}
        </MapContainer>
    );
};
