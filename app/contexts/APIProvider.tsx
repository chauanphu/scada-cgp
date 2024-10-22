import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import {
    getToken,
    checkLogin,
    getClusters,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    getFullClusters,
    createCluster,
    updateCluster,
    deleteCluster,
    getEnergyData,
    getRoles,
    getAuditLogs,
    downloadCSVAudit,
    getPermissions,
    View,
    User
} from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Cluster, CreateClusterData } from "@/types/Cluster";

const APIContext = createContext<any>(null);

interface APIProviderProps {
    children: ReactNode;
}

export const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [permissions, setPermissions] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const checkUserAuth = async () => {
            const storedToken = Cookies.get("token");
            if (storedToken && await checkLogin(storedToken)) {
                setToken(storedToken);
                setIsAuthenticated(true);
                fetchClusters(storedToken);
                fetchPermissions(storedToken);  // Fetch permissions
            } else {
                setToken(null);
                setIsAuthenticated(false);
                router.push("/login");
            }
        };

        checkUserAuth();
    }, [router]);

    const fetchClusters = async (token: string) => {
        const data = await getClusters(token);
        setClusters(data);
    };

    const fetchPermissions = async (token: string) => {
        try {
            const userPermissions = await getPermissions(token);
            setPermissions(userPermissions);
        } catch (error) {
            console.error("Failed to fetch permissions", error);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const authToken = await getToken(username, password);
            Cookies.set("token", authToken);

            setToken(authToken);
            setIsAuthenticated(true);
            fetchClusters(authToken);
            fetchPermissions(authToken);  // Fetch permissions after login
        } catch (error) {
            console.error("Login failed", error);
            setIsAuthenticated(false);
        }
    };

    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        Cookies.remove('token');
        router.push("/login");
    };

    const hasPermission = (permission: string): boolean => {
        return permissions.includes(permission);
    };

    return (
        <APIContext.Provider
            value={{
                token,
                isAuthenticated,
                clusters,
                permissions,
                login,
                logout,
                hasPermission, 
                getUsers: () => token ? getUsers(token) : Promise.reject("Not authenticated"),
                createUser: (userData: Partial<User>) => token ? createUser(token, userData) : Promise.reject("Not authenticated"),
                updateUser: (userId: number, userData: Partial<User>) => token ? updateUser(token, userId, userData) : Promise.reject("Not authenticated"),
                deleteUser: (userId: number) => token ? deleteUser(token, userId) : Promise.reject("Not authenticated"),
                getFullClusters: () => token ? getFullClusters(token) : Promise.reject("Not authenticated"),
                createCluster: (clusterData: CreateClusterData) => token ? createCluster(token, clusterData) : Promise.reject("Not authenticated"),
                updateCluster: (clusterId: number, clusterData: Partial<CreateClusterData>) => token ? updateCluster(token, clusterId, clusterData) : Promise.reject("Not authenticated"),
                deleteCluster: (clusterId: number) => token ? deleteCluster(token, clusterId) : Promise.reject("Not authenticated"),
                getEnergyData: (view: View) => token ? getEnergyData(token, view) : Promise.reject("Not authenticated"),
                getRoles: () => token ? getRoles(token) : Promise.reject("Not authenticated"),
                getAuditLogs: (page: number = 1, page_size: number = 10) => token ? getAuditLogs(token, page, page_size) : Promise.reject("Not authenticated"),
                downloadCSVAudit: () => token ? downloadCSVAudit(token) : Promise.reject("Not authenticated"),
            }}
        >
            {children}
        </APIContext.Provider>
    );
};

export const useAPI = () => useContext(APIContext);
