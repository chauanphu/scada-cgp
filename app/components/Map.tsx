import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { District } from '../types/lightTypes';
import iconOn from '@/images/markers/on.png';
import iconOff from '@/images/markers/off.png';
import iconDisable from '@/images/markers/disable.png';
import { RightSidebar } from './RightSidebar';

interface MapProps {
    districts: District[];
    selectedLight: District['lightBulbs'][0] | null;
    selectedDistrict: District;
    handleToggleLight: (lightId: string) => void;
    setSelectedLight: (light: District['lightBulbs'][0] | null) => void; 
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

export const Map = ({ districts, handleToggleLight, selectedDistrict, selectedLight, setSelectedLight }: MapProps) => { 

    return (
        <div className="flex">
            <MapContainer
                center={[10.8231, 106.6297] as LatLngExpression}
                zoom={22}
                className='h-screen w-full'
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {districts.flatMap((district) =>
                    district.lightBulbs.map((light) => (
                        <Marker
                            key={light.id}
                            position={[light.lat, light.lng] as LatLngExpression}
                            eventHandlers={{
                                click: () => {
                                    setSelectedLight(light); 
                                },
                            }}
                            icon={GetIcon(30, light.isConnected, light.isOn)}
                        />
                    ))
                )}
            </MapContainer>
            <RightSidebar 
                selectedLight={selectedLight} 
                handleToggleLight={handleToggleLight} 
                selectedDistrict={selectedDistrict} 
            />
        </div>
    );
};
