'use client';

import { useEffect, useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Map } from '@/components/Map';
import { Cluster } from '@/types/Cluster';
import Cookies from 'js-cookie';
import { getClusters, getPermissions } from '@/lib/api';
import { WebSocketProvider } from '@/contexts/WebsocketProvider';
import { APIProvider, useAPI } from '@/contexts/APIProvider';
import { Navbar, PermissionEnum } from '@/components/NavBar';
import NotificationCard from './components/NotificationCard';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Cluster['units'][0] | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loadingClusters, setLoadingClusters] = useState<boolean>(true);  
  const { isAuthenticated,permissions } = useAPI() || {};

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    setLoadingClusters(true);
    const token = Cookies.get('token') || '';
    try {
      const data = await getClusters(token);
      setClusters(data);
    } catch (error) {
      console.error('Error fetching clusters:', error);
    } finally {
      setLoadingClusters(false);
    }
  };


  const handleToggleUnit = (unitId: number) => {
    setClusters(prevClusters =>
      prevClusters
        ? prevClusters.map(cluster => ({
            ...cluster,
            units: cluster.units.map(unit =>
              unit.id === unitId ? { ...unit, toggle: !unit.toggle } : unit
            ),
          }))
        : prevClusters
    );
  };

  const filteredClusters = clusters && clusters.length > 0
    ? clusters
        .map(cluster => ({
          ...cluster,
          units: cluster.units.filter(unit =>
            unit.name.toLowerCase().includes(searchTerm.toLowerCase())
          ),
        }))
        .filter(cluster => cluster.units.length > 0)
    : [];

  return (
    <APIProvider>
      <WebSocketProvider>
        <div className="flex flex-col h-screen w-screen">
          {/* Loading state for permissions */}
        
            <Navbar permissions={permissions} />
            <NotificationCard />
          <div className="bg-white absolute z-10 w-full lg:w-1/5 h-[40vh] lg:h-full">
            <LeftSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCluster={selectedCluster}
              setSelectedCluster={setSelectedCluster}
              filteredClusters={filteredClusters}
              setSelectedUnit={setSelectedUnit}
            />
          </div>

          <div className="flex-grow z-0 h-[60vh] lg:h-screen lg:w-screen">
            {/* Loading state for clusters */}
            {loadingClusters ? (
              <div>Loading clusters...</div>
            ) : (
              <Map
                handleToggleUnit={handleToggleUnit}
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                clusters={filteredClusters}
              />
            )}
          </div>
        </div>
      </WebSocketProvider>
    </APIProvider>
  );
}
