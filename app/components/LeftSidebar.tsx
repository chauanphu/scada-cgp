import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader, CardContent } from "@/components/ui/card"
import { District } from '@/types/lightTypes';


interface LeftSidebarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedDistrict: string | null;
  setSelectedDistrict: React.Dispatch<React.SetStateAction<string | null>>;
  filteredDistricts: District[];
  handleToggleLight: (lightId: string) => void;
  setSelectedLight: React.Dispatch<React.SetStateAction<District['lightBulbs'][0] | null>>;
}

export const LeftSidebar = ({
  selectedDistrict, setSelectedDistrict,
  filteredDistricts, handleToggleLight, setSelectedLight,
}: LeftSidebarProps) => {
typeof window === "undefined"
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
          <h3 className="text-lg font-semibold mb-2">Danh sách tủ điều khiển</h3>
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
                        className={`h-2 w-2 rounded-full mr-2 ${!light.isConnected ? 'bg-red-400' : (light.isOn ? 'bg-green-400' : 'bg-gray-400')}`} />
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
  );
}
