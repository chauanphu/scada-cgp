// app/contexts/WebsocketProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAPI } from './APIProvider';
import { NEXT_PUBLIC_WS_URL } from '@/lib/api';

const WebSocketContext = createContext<any>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export type UnitStatus = {
    id: number;
    isOn: boolean;
    isConnected: boolean;
    power: number;
    current: number;
    voltage: number;
    gps_log: number;
    gps_lat: number;
};

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const { token, isAuthenticated, clusters } = useAPI();
    const [sockets, setSockets] = useState<Map<number, WebSocket>>(new Map());
    const [unitStatus, setUnitStatus] = useState<Record<number, UnitStatus>>({});
    const [selectedUnit, setSelectedUnit] = useState<UnitStatus | null>(null);

    useEffect(() => {
        const connectWebSocket = (unitId: number) => {
            const ws = new WebSocket(`${NEXT_PUBLIC_WS_URL}/unit/${unitId}/status`);

            ws.onopen = () => {
                console.log(`WebSocket Connected for unit ${unitId}`);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                const isConnected = data.power !== 0;
                const isOn = data.toggle === 1;

                setUnitStatus((prevState) => ({
                    ...prevState,
                    [unitId]: { 
                        id: unitId,
                        isOn, 
                        isConnected,
                        power: data.power,
                        current: data.current,
                        voltage: data.voltage,
                        gps_log: data.gps_log,
                        gps_lat: data.gps_lat,
                    },
                }));

                // Handle "alive" status if necessary
                if (data.alive === "0") {
                    setUnitStatus((prevState) => ({
                        ...prevState,
                        [unitId]: { 
                            ...prevState[unitId], 
                            isConnected: false,
                            power: 0,
                            current: 0,
                            voltage: 0,
                            gps_log: 0,
                            gps_lat: 0,
                        },
                    }));
                }
            };

            ws.onerror = (error) => {
                console.error(`WebSocket Error for unit ${unitId}:`, error);
            };

            ws.onclose = () => {
                console.log(`WebSocket Disconnected for unit ${unitId}`);
                // Attempt to reconnect after 3 seconds
                setTimeout(() => {
                    // connectWebSocket(unitId);
                }, 3000);
            };

            return ws;
        };

        if (isAuthenticated && token && clusters.length > 0) {
            const newSockets = new Map<number, WebSocket>();
            clusters.forEach((cluster: { units: any[]; }) => {
                cluster.units.forEach(unit => {
                    const ws = connectWebSocket(unit.id);
                    newSockets.set(unit.id, ws);
                });
            });
            setSockets(newSockets);

            return () => {
                newSockets.forEach((ws) => ws.close());
            };
        }
    }, [isAuthenticated, token, clusters]);

    const sendMessage = (unitId: number, message: string) => {
        const ws = sockets.get(unitId);
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ message }));
        } else {
            console.warn(`WebSocket for unit ${unitId} is not open.`);
        }
    };

    const toggleLight = (unitId: number) => {
        const status = unitStatus[unitId];
        if (status) {
            setUnitStatus((prevState) => ({
                ...prevState,
                [unitId]: { ...status, isOn: !status.isOn },
            }));
        }
    };

    return (
        <WebSocketContext.Provider value={{ unitStatus, selectedUnit, setSelectedUnit, toggleLight, sendMessage }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);