'use client';
import { useEffect, useState } from 'react';
import { LeftSidebar } from '@/components/LeftSidebar';
import { Map } from '@/components/Map';
import { Cluster } from '@/types/Cluster'; // Update the imports
import Cookies from 'js-cookie';
import { getClusters } from '@/lib/api';

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<Cluster['units'][0] | null>(null);
  const [clusters, setClusters] = useState<Cluster[]>([]); // Store fetched clusters

  useEffect(() => {
    fetchClusters(); 
  }, []);


  const fetchClusters = async () => {
      const token = Cookies.get('token') || '';
      const data = await getClusters(token);
      setClusters(data);
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
