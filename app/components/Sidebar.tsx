import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LightControls } from './LightControls'
import { Search, Lightbulb, WifiOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { District } from '@/types/lightTypes'

interface SidebarProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedDistrict: string | null
  setSelectedDistrict: (id: string | null) => void
  handleBulkAction: (action: 'on' | 'off' | 'disconnect') => void
  filteredDistricts: District[]
  handleToggleLight: (districtId: string, lightId: string) => void
  handleDisconnectLight: (districtId: string, lightId: string) => void
}

export const Sidebar = ({
  searchTerm, setSearchTerm, selectedDistrict, setSelectedDistrict, handleBulkAction,
  filteredDistricts, handleToggleLight, handleDisconnectLight
}: SidebarProps) => {
  return (
    <>
      <CardHeader>
        <CardTitle>Districts</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search light bulbs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select onValueChange={setSelectedDistrict}>
          <SelectTrigger>
            <SelectValue placeholder="Select a district" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Districts</SelectItem>
            {filteredDistricts.map((district) => (
              <SelectItem key={district.id} value={district.id}>{district.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <LightControls handleBulkAction={handleBulkAction} />
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {filteredDistricts.map(district => (
            <AccordionItem value={district.id} key={district.id}>
              <AccordionTrigger>{district.name}</AccordionTrigger>
              <AccordionContent>
                {district.lightBulbs.map(light => (
                  <div key={light.id} className="flex items-center justify-between py-2">
                    <span>{light.name}</span>
                    <div className="flex space-x-2">
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </>
  )
}
