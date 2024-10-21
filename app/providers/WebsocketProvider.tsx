import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useAPI } from "./APIProvider";

const WebSocketContext = createContext<any>(null);

interface WebSocketProviderProps {
    children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
    const { token, isAuthenticated, getClusters } = useAPI();
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [power, setPower] = useState<number>(0);
    const [current, setCurrent] = useState<number>(0);
    const [voltage, setVoltage] = useState<number>(0);
    const [isOn, setIsOn] = useState<boolean>(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(null); 

    useEffect(() => {
        const fetchClusterData = async () => {
            if (isAuthenticated && token) {
                try {
                    const clusters = await getClusters();
                    if (clusters.length > 0) {
                        const firstCluster = clusters[0];
                        const firstUnit = firstCluster.units ? firstCluster.units[0] : null;
                        setSelectedUnit(firstUnit);
                    }
                } catch (error) {
                    console.error("Failed to fetch clusters", error);
                }
            }
        };

        fetchClusterData();
    }, [isAuthenticated, token, getClusters]);

    useEffect(() => {
        if (isAuthenticated && token && selectedUnit) {
            const ws = new WebSocket(`ws://api.cgp.captechvn.com/ws/unit/${selectedUnit.id}/status`);

            ws.onopen = () => {
                console.log("WebSocket Connected");
                setIsConnected(true);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data) {
                    setPower(data.power);
                    setCurrent(data.current);
                    setVoltage(data.voltage);
                    setIsOn(data.toggle === 1);
                }
                console.log("Received WebSocket message:", data);
            };

            ws.onerror = (error) => {
                console.error("WebSocket Error:", error);
                setIsConnected(false);
            };

            ws.onclose = () => {
                console.log("WebSocket Disconnected, reconnecting...");
                setIsConnected(false);
                setTimeout(() => {
                    setSocket(new WebSocket(`ws://api.cgp.captechvn.com/ws/unit/${selectedUnit.id}/status`));
                }, 3000);
            };

            setSocket(ws);

            return () => {
                ws.close();
            };
        }
    }, [isAuthenticated, token, selectedUnit]);

    const sendMessage = (message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ message }));
        } else {
            console.warn("WebSocket is not open.");
        }
    };

    const toggleLight = () => {
        if (isOn) {
            sendMessage(JSON.stringify({ toggle: 0 }));
        } else {
            sendMessage(JSON.stringify({ toggle: 1 }));
        }
        setIsOn(prevState => !prevState);
    };

    return (
        <WebSocketContext.Provider value={{
            socket,
            isConnected,
            power,
            current,
            voltage,
            isOn,
            toggleLight,
            sendMessage
        }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
