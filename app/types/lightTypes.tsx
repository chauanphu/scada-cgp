export type Schedule = {
  on: string;  
  off: string;  
}

export type LightBulb = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  isOn: boolean;
  isConnected: boolean;
  powerUsage: number;    
  hoursActive: number;   
  schedule: Schedule;    
}

export type District = {
  id: string;
  name: string;
  lightBulbs: LightBulb[];
}
