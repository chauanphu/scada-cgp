'use client';
import { useEffect, useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Map } from '@/components/Map';
import { Cluster } from '@/types/Cluster'; // Update the imports
import Cookies from 'js-cookie';
import { Navbar } from './components/NavBar';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Cluster['units'][0] | null>(null);
  const [isAdmin, setIsAdmin] = useState<Boolean | undefined>(false);
  const [clusters, setClusters] = useState<Cluster[] | null>(null); // Store fetched clusters

  useEffect(() => {
    checkRole();
    fetchClusters(); 
  }, []);


  const fetchClusters = async () => {
      const token = Cookies.get('token');
      const response = await fetch('/api/clusters/my-clusters', {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
          },
      });
      const data = await response.json();
      console.log(data);
      setClusters(data); 
  };

  const checkRole = async () => {
    const token = Cookies.get('token');
    const response = await fetch("/api/auth/user/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setIsAdmin(data.is_admin);
  };

  const handleToggleUnit = (unitId: number) => {
    setClusters(prevClusters =>
      prevClusters?.map(cluster => ({
        ...cluster,
        units: cluster.units.map(unit => 
          unit.id === unitId ? { ...unit, isOn: !unit.isOn } : unit
        )
      }))
    );
  };

  const filteredClusters = clusters
    ?.map(cluster => ({
      ...cluster,
      units: cluster.units.filter(unit =>
        unit.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(cluster => cluster.units.length > 0) || [];

  return (
    <div className="flex flex-col h-screen w-screen">
      <Navbar isAdmin={isAdmin} />

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
          clusters={clusters}
          handleToggleUnit={handleToggleUnit}
          selectedUnit={selectedUnit}
          selectedCluster={selectedCluster!} // Pass the selected cluster to Map
          setSelectedUnit={setSelectedUnit}
        />
      </div>
    </div>
  );
}
