import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { useAPI } from "./APIProvider";
import {NEXT_PUBLIC_WS_URL} from "@/lib/api";
import { Schedule } from "@/types/Cluster";

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
        let reconnectTimeout: NodeJS.Timeout | null = null;

        // Function to initialize the WebSocket
        const connectWebSocket = () => {
            if (isAuthenticated && token && selectedUnit) {
                if (socket) {
                    // Close any existing socket before creating a new one
                    socket.close();
                }
                const ws = new WebSocket(`${NEXT_PUBLIC_WS_URL}/unit/${selectedUnit.id}/status`);

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
                };

                ws.onerror = (error) => {
                    console.error("WebSocket Error:", error);
                    setIsConnected(false);
                };

                ws.onclose = () => {
                    console.log("WebSocket Disconnected, reconnecting in 3 seconds...");
                    setIsConnected(false);

                    // Delay reconnection to avoid spamming reconnection attempts
                    reconnectTimeout = setTimeout(() => {
                        connectWebSocket(); // Reconnect
                    }, 3000);
                };

                setSocket(ws);
            }
        };

        if (selectedUnit) {
            connectWebSocket(); // Only connect WebSocket when selectedUnit is set
        }

        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (socket) {
                socket.close();
            }
        };
    }, [isAuthenticated, token, selectedUnit]);

    const sendMessage = (message: string) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
        } else {
            console.warn("WebSocket is not open.");
        }
    };

    const toggleLight = () => {
        sendMessage(JSON.stringify({ toggle: !isOn }));
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