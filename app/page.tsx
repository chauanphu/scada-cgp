'use client'
import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Map } from '@/components/Map'
import { District } from '@/types/lightTypes'

import { mockDistricts } from '@/data/mockData';



export default function HomePage() {
  const [districts, setDistricts] = useState<District[]>(mockDistricts)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null)

  const handleToggleLight = (districtId: string, lightId: string) => {
    setDistricts(districts.map(district => {
      if (district.id === districtId) {
        return {
          ...district,
          lightBulbs: district.lightBulbs.map(light =>
            light.id === lightId ? { ...light, isOn: !light.isOn } : light
          )
        }
      }
      return district
    }))
  }

  const handleDisconnectLight = (districtId: string, lightId: string) => {
    setDistricts(districts.map(district => {
      if (district.id === districtId) {
        return {
          ...district,
          lightBulbs: district.lightBulbs.map(light =>
            light.id === lightId ? { ...light, isConnected: false, isOn: false } : light
          )
        }
      }
      return district
    }))
  }

  const handleBulkAction = (action: 'on' | 'off' | 'disconnect') => {
    setDistricts(districts.map(district => {
      if (!selectedDistrict || district.id === selectedDistrict) {
        return {
          ...district,
          lightBulbs: district.lightBulbs.map(light => {
            switch (action) {
              case 'on':
                return { ...light, isOn: true }
              case 'off':
                return { ...light, isOn: false }
              case 'disconnect':
                return { ...light, isConnected: false, isOn: false }
              default:
                return light
            }
          })
        }
      }
      return district
    }))
  }

  const filteredDistricts = districts.map(district => ({
    ...district,
    lightBulbs: district.lightBulbs.filter(light =>
      light.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!selectedDistrict || district.id === selectedDistrict)
    )
  })).filter(district => district.lightBulbs.length > 0)

  return (
    <div className="flex flex-col h-screen lg:flex-row">
      <div className="bg-white absolute z-10 w-full lg:w-1/5 h-[40vh] lg:h-full">
        <Sidebar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedDistrict={selectedDistrict}
          setSelectedDistrict={setSelectedDistrict}
          handleBulkAction={handleBulkAction}
          filteredDistricts={filteredDistricts}
          handleToggleLight={handleToggleLight}
          handleDisconnectLight={handleDisconnectLight}
        />
      </div>
      <div className="flex-grow z-0 h-[60vh] lg:h-screen lg:w-screen">
        <Map districts={districts} handleToggleLight={handleToggleLight} />
      </div>
    </div>
  )
}
