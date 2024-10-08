export type LightBulb = {
    id: string
    name: string
    lat: number
    lng: number
    isOn: boolean
    isConnected: boolean
  }
  
  export type District = {
    id: string
    name: string
    lightBulbs: LightBulb[]
  }
  