import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { getToken, checkLogin, getClusters, getUsers, createUser, updateUser, deleteUser, getFullClusters, createCluster, updateCluster, deleteCluster, getEnergyData, getRoles, getAuditLogs, downloadCSVAudit, View, User } from "@/lib/api";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { CreateClusterData } from "@/types/Cluster";

const APIContext = createContext<any>(null);

interface APIProviderProps {
    children: ReactNode;
}

export const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkUserAuth = async () => {
            const storedToken = Cookies.get("token");
            if (storedToken && await checkLogin(storedToken)) {
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                setToken(null);
                setIsAuthenticated(false);
                router.push("/login");
            }
        };

        checkUserAuth();
    }, [router]);
    const login = async (username: string, password: string) => {
        try {
            const authToken = await getToken(username, password);
            Cookies.set("token", authToken);

            setToken(authToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed", error);
            setIsAuthenticated(false);
        }
    };


    const logout = () => {
        setToken(null);
        setIsAuthenticated(false);
        Cookies.remove('token')
        router.push("/login");
    };


    return (
        <APIContext.Provider
            value={{
                token,
                isAuthenticated,
                login,
                logout,


                getUsers: () => token ? getUsers(token) : Promise.reject("Not authenticated"),
                createUser: (userData: Partial<User>) => token ? createUser(token, userData) : Promise.reject("Not authenticated"),
                updateUser: (userId: number, userData: Partial<User>) => token ? updateUser(token, userId, userData) : Promise.reject("Not authenticated"),
                deleteUser: (userId: number) => token ? deleteUser(token, userId) : Promise.reject("Not authenticated"),


                getClusters: () => token ? getClusters(token) : Promise.reject("Not authenticated"),
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
