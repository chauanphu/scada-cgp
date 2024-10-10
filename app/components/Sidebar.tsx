import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Search, Lightbulb, WifiOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { District } from '@/types/lightTypes'

interface SidebarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDistrict: string | null
  setSelectedDistrict: (id: string | null) => void
  filteredDistricts: District[]
  handleToggleLight: (districtId: string, lightId: string) => void
  handleDisconnectLight: (districtId: string, lightId: string) => void
}

export const Sidebar = ({
  searchTerm, setSearchTerm, selectedDistrict, setSelectedDistrict,
  filteredDistricts, handleToggleLight, handleDisconnectLight
}: SidebarProps) => {
  
  const handleDistrictSelect = (value: string) => {
    if (value === 'all') {
      setSelectedDistrict(null);
    } else {
      setSelectedDistrict(value);
    }
  };

  const availableDistricts = filteredDistricts.filter(district => district.id !== selectedDistrict);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-gray-200">
        <CardHeader>
          <CardTitle>Districts</CardTitle>
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

      <div className="flex-grow overflow-y-auto p-2">
        <CardContent>
          {filteredDistricts.map(district => (
            <div key={district.id} className="mb-6">
              <h3 className="text-lg font-semibold">{district.name}</h3>
              <div className="pl-4">
                {district.lightBulbs.map(light => (
                  <div key={light.id} className="flex items-center justify-between py-2">
                    <span>{light.name}</span>
                    <div className="flex space-x-1">
                      <Button
                        variant={light.isOn ? "default" : "secondary"}
                        size="sm"
                        onClick={() => handleToggleLight(district.id, light.id)}
                        disabled={!light.isConnected}
                      >
                        <Lightbulb className={`mr-2 h-4 w-4 ${light.isOn ? 'text-yellow-400' : ''}`} />
                        {light.isOn ? 'On' : 'Off'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDisconnectLight(district.id, light.id)}
                        disabled={!light.isConnected}
                      >
                        <WifiOff className="mr-2 h-4 w-4" />
                        Disconnect
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
