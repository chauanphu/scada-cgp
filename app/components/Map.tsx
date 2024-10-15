import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { District } from '../types/lightTypes';
import iconOn from '@/images/markers/on.png';
import iconOff from '@/images/markers/off.png';
import iconDisable from '@/images/markers/disable.png';
import { RightSidebar } from './RightSidebar';
import { renderToStaticMarkup } from 'react-dom/server';
import { Codesandbox } from 'lucide-react';
interface MapProps {
    districts: District[];
    selectedLight: District['lightBulbs'][0] | null;
    selectedDistrict: District;
    handleToggleLight: (lightId: string) => void;
    setSelectedLight: (light: District['lightBulbs'][0] | null) => void;
}

function GetIcon(iconSize: number, isConnected: boolean, isLightOn: boolean, isControlHouse = false) {
    const size: [number, number] = [iconSize, iconSize];

    if (isControlHouse) {
        const svgString = renderToStaticMarkup(<Codesandbox size={iconSize} color="blue" />);
        const iconUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

        return L.icon({ iconUrl, iconSize: size });
    }

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
    const mapRef = useRef(null);

    const panToLight = (light: District['lightBulbs'][0]) => {
        if (mapRef.current) {
            const map = mapRef.current;
            map.setView([light.lat, light.lng - 0.001], 22);
        }
    };

    useEffect(() => {
        if (selectedLight) {
            panToLight(selectedLight);
        }
    }, [selectedLight]);

    return (
        <div className="flex">
            <MapContainer
                ref={mapRef}
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

                {districts.map(district => (
                    <>
                        <Marker
                            key={district.id}
                            position={[district.lat, district.lng] as LatLngExpression}
                            eventHandlers={{
                                click: () => {
                                    // setSelectedLight(light); 
                                },
                            }}
                            icon={GetIcon(40, true, true, true)}
                        />
                    </>

                ))}

            </MapContainer>
            <RightSidebar
                selectedLight={selectedLight}
                handleToggleLight={handleToggleLight}
            />
        </div>
    );
};

export default Map;
