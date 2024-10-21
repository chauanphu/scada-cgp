import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardHeader, CardContent } from "@/components/ui/card";
import { Search } from 'lucide-react';
import { Cluster } from '@/types/Cluster'; 
import { Input } from "@/components/ui/input";
import { NEXT_PUBLIC_WS_URL } from "@/lib/api";

interface LeftSidebarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedCluster: Cluster | null;
  setSelectedCluster: React.Dispatch<React.SetStateAction<Cluster | null>>;
  filteredClusters: Cluster[];
  setSelectedUnit: React.Dispatch<React.SetStateAction<Cluster['units'][0] | null>>;
}

export const LeftSidebar = ({
  searchTerm, setSearchTerm,
  selectedCluster, setSelectedCluster,
  filteredClusters, setSelectedUnit,
}: LeftSidebarProps) => {
  const [unitStatus, setUnitStatus] = useState<Record<number, { isOn: boolean, isConnected: boolean }>>({});

  const handleClusterSelect = (value: string) => {
    const clusterId = parseInt(value, 10);
    const selected = filteredClusters.find(cluster => cluster.id === clusterId) || null;
    setSelectedCluster(selected);
  };

  const handleUnitSelect = (clusterId: number, unit: Cluster['units'][0]) => {
    setSelectedUnit(unit); 
  };

  // const initializeWebSocket = (unitId: number) => {
  //   const ws = new WebSocket(`${NEXT_PUBLIC_WS_URL}/unit/${unitId}/status`);

  //   ws.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     const isConnected = data.power !== 0;
  //     const isOn = data.toggle === 1;

  //     setUnitStatus(prevState => ({
  //       ...prevState,
  //       [unitId]: { isOn, isConnected },
  //     }));
  //   };

  //   ws.onerror = (error) => {
  //     console.error('WebSocket error:', error);
  //   };

  //   ws.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };

  //   return () => {
  //     if (ws) {
  //       ws.close();
  //     }
  //   };
  // };

  // useEffect(() => {
  //   filteredClusters.forEach(cluster => {
  //     cluster.units.forEach(unit => {
  //       initializeWebSocket(unit.id);
  //     });
  //   });
  // }, [filteredClusters]);

  const getStatusColor = (isConnected: boolean, isOn: boolean): string => {
    if (!isConnected) return 'bg-gray-500'; // Disconnected
    return isOn ? 'bg-green-500' : 'bg-red-500'; // Green for "on", Red for "off"
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-14 border-b border-gray-200">
        <CardHeader>
          <h3 className="text-lg font-semibold mb-2">Danh sách Cụm</h3>
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative px-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 h-9 w-full bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-muted-foreground/60"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
          <Select onValueChange={handleClusterSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn Cụm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"0"}>Tất cả</SelectItem>
              {filteredClusters.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id.toString()}>{cluster.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
      </div>

      <div className="flex-grow overflow-y-auto p-1">
        <CardContent>
          {filteredClusters.map(cluster => (
            <div key={cluster.id} className="mt-6 mb-6">
              <h3 className="text-md font-semibold">{cluster.name}</h3>
              <div className="pl-2">
                {cluster.units.map(unit => {
                  const status = unitStatus[unit.id] || { isOn: false, isConnected: false };
                  const statusColor = getStatusColor(status.isConnected, status.isOn);

                  return (
                    <div key={unit.id} className="flex items-center justify-between py-2">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => handleUnitSelect(cluster.id, unit)}
                      >
                        <span className={`w-3 h-3 rounded-full mr-2 ${statusColor}`}></span>
                        <span>{unit.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <hr className="border-t border-gray-300 mt-4" />
            </div>
          ))}
        </CardContent>
      </div>
    </div>
  );
};
