import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Search } from 'lucide-react'
import { useState } from "react";
import { District } from '@/types/lightTypes';

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
          <h3 className="text-lg font-semibold mb-2">Danh sách đèn ở các Quận</h3>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm tên đèn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select onValueChange={handleDistrictSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn Khu Vực" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
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
            <div key={district.id} className="mt-6 mb-6">
              <h3 className="text-md font-semibold">{district.name}</h3>
              <div className="pl-2">
                {district.lightBulbs.map(light => (
                  <div key={light.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center cursor-pointer" onClick={() => handleLightSelect(district.id, light)}>
                      <div
                        className={`h-2 w-2 rounded-full mr-2 ${!light.isConnected ? 'bg-red-400' : (light.isOn ? 'bg-yellow-400' : 'bg-gray-400')}`} />
                      <span>{light.name}</span>
                    </div>
                  </div>
                ))}
              </div>
              <hr className="border-t border-gray-300 mt-4" />
            </div>
          ))}
        </CardContent>
      </div>
    </div>
  )
}
