'use client'
import { useState } from 'react'
import { LeftSidebar } from '@/components/LeftSidebar'
import { Map } from '@/components/Map'
import { District } from '@/types/lightTypes'
import { mockDistricts } from '@/data/mockData';
import { Navbar } from './components/NavBar';
import { roleCheck } from './lib/api'

export default function HomePage() {
  const [districts, setDistricts] = useState<District[]>(mockDistricts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedLight, setSelectedLight] = useState<District['lightBulbs'][0] | null>(null);
  roleCheck

  const handleToggleLight = (lightId: string) => {
    setDistricts(prevDistricts => {
      return prevDistricts.map(district => {
        const light = district.lightBulbs.find(light => light.id === lightId);
        if (light) {
          return {
            ...district,
            lightBulbs: district.lightBulbs.map(l => {
              if (l.id === lightId) {
                return { ...l, isOn: !l.isOn };  
              }
              return l;
            }),
          };
        }
        return district;
      });
    });
  };

  
  const filteredDistricts = districts.map(district => ({
    ...district,
    lightBulbs: district.lightBulbs.filter(light =>
      light.name.toLowerCase().includes(searchTerm.toLowerCase()) &&  
      (!selectedDistrict || district.id === selectedDistrict)         
    )
  })).filter(district => district.lightBulbs.length > 0);  

  return (
    <div className="flex flex-col h-screen w-screen">
      
      <Navbar isAdmin searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="bg-white absolute z-10 w-full lg:w-1/5 h-[40vh] lg:h-full">
        <LeftSidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          filteredDistricts={filteredDistricts}
          handleToggleLight={handleToggleLight}
          setSelectedLight={setSelectedLight}
        />

      </div>

      <div className="flex-grow z-0 h-[60vh] lg:h-screen lg:w-screen">
        <Map
          districts={districts}
          handleToggleLight={handleToggleLight}
          selectedLight={selectedLight}
          selectedDistrict={districts.find(d => d.id === selectedDistrict)!}
          setSelectedLight={setSelectedLight}
        />
      </div>
    </div>
  );
}
