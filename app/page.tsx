'use client';
import { useEffect, useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Map } from '@/components/Map';
import { Cluster } from '@/types/Cluster'; // Update the imports
import Cookies from 'js-cookie';
import { Navbar, PermissionEnum } from './components/NavBar';
import { getClusters, NEXT_PUBLIC_API_URL } from '@/lib/api';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Cluster['units'][0] | null>(null);
  const [permissions, setPermissions] = useState<PermissionEnum[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]); // Store fetched clusters

  useEffect(() => {
    getPermissions();
    fetchClusters(); 
  }, []);


  const fetchClusters = async () => {
      const token = Cookies.get('token') || '';
      const data = await getClusters(token);
      setClusters(data);
  };

  const getPermissions = async () => {
    const token = Cookies.get('token');
    const response = await fetch(`${NEXT_PUBLIC_API_URL}/auth/role/check`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setPermissions(data.permissions.map((permission: any) => permission.permission_name));
  };

  const handleToggleUnit = (unitId: number) => {
    setClusters(prevClusters =>
      prevClusters ? prevClusters.map(cluster => ({
        ...cluster,
        units: cluster.units.map(unit => 
          unit.id === unitId ? { ...unit, toggle: !unit.toggle } : unit
        )
      })) : prevClusters
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
    <div className="flex flex-col h-screen w-screen">
      <Navbar permissions={permissions} />

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
        <Map
          handleToggleUnit={handleToggleUnit}
          selectedUnit={selectedUnit}
          setSelectedUnit={setSelectedUnit}
          clusters={filteredClusters}
        />
      </div>
    </div>
  );
}
