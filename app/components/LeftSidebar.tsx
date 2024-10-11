import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Search, Lightbulb, Unplug } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { District } from '@/types/lightTypes'
import { useState } from "react";

interface LeftSidebarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDistrict: string | null
  setSelectedDistrict: (id: string | null) => void
  filteredDistricts: District[]
  handleToggleLight: (lightId: string) => void
  setSelectedLight: (light: District['lightBulbs'][0] | null) => void;
}

export const LeftSidebar = ({
  searchTerm, setSearchTerm, selectedDistrict, setSelectedDistrict,
  filteredDistricts, handleToggleLight, setSelectedLight,
}: LeftSidebarProps) => {

  const handleDistrictSelect = (value: string) => {
    if (value === 'all') {
      setSelectedDistrict(null);
    } else {
      setSelectedDistrict(value);
    }
  };

  const availableDistricts = filteredDistricts.filter(district => district.id !== selectedDistrict);

  const handleLightSelect = (districtId: string, light: District['lightBulbs'][0]) => {
    setSelectedLight(light); 
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-200">
        <CardHeader>
          <h3 className="text-lg font-semibold mb-2">Districts</h3>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search light bulbs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select onValueChange={handleDistrictSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Select a district" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              {availableDistricts.map((district) => (
                <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
      </div>

      <div className="flex-grow overflow-y-auto p-1">
        <CardContent>
          {filteredDistricts.map(district => (
            <div key={district.id} className="mb-6">
              <h3 className="text-lg font-semibold">{district.name}</h3>
              <div className="pl-2">
                {district.lightBulbs.map(light => (
                  <div key={light.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center cursor-pointer" onClick={() => handleLightSelect(district.id, light)}>
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${!light.isConnected ? 'bg-red-400' : (light.isOn ? 'bg-yellow-400' : 'bg-gray-400')}`} />
                      <span>{light.name}</span>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant={light.isOn ? "default" : "secondary"}
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleToggleLight(light.id); }} 
                        disabled={!light.isConnected}
                        className="w-32" 
                      >
                        {light.isConnected ? (
                          <>
                            <Lightbulb className={`mr-2 h-4 w-4 ${light.isOn ? 'text-yellow-400' : ''}`} />
                            {light.isOn ? 'On' : 'Off'}
                          </>
                        ) : (
                          <>
                            <Unplug className="mr-2 h-4 w-4 text-red-500" />
                            Disconnected
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </div>
    </div>
  )
}
