import { District } from '@/types/lightTypes';

export const mockDistricts: District[] = [
  {
    id: '1',
    name: 'District 1',
    lightBulbs: [
      { id: '1', name: 'Light Bulb 1', lat: 10.8231, lng: 106.6297, isOn: true, isConnected: true },
      { id: '2', name: 'Light Bulb 2', lat: 10.8241, lng: 106.6307, isOn: false, isConnected: true },
      { id: '3', name: 'Light Bulb 3', lat: 10.8251, lng: 106.6317, isOn: true, isConnected: false },
    ],
  },
  {
    id: '2',
    name: 'District 2',
    lightBulbs: [
      { id: '4', name: 'Light Bulb 4', lat: 10.8221, lng: 106.6277, isOn: true, isConnected: true },
      { id: '5', name: 'Light Bulb 5', lat: 10.8211, lng: 106.6287, isOn: false, isConnected: true },
      { id: '6', name: 'Light Bulb 6', lat: 10.8201, lng: 106.6297, isOn: true, isConnected: false },
    ],
  },
  {
    id: '3',
    name: 'District 3',
    lightBulbs: [
      { id: '7', name: 'Light Bulb 7', lat: 10.8261, lng: 106.6327, isOn: false, isConnected: true },
      { id: '8', name: 'Light Bulb 8', lat: 10.8271, lng: 106.6337, isOn: true, isConnected: true },
      { id: '9', name: 'Light Bulb 9', lat: 10.8281, lng: 106.6347, isOn: false, isConnected: true },
    ],
  },
  {
    id: '4',
    name: 'District 4',
    lightBulbs: [
      { id: '10', name: 'Light Bulb 10', lat: 10.8291, lng: 106.6357, isOn: true, isConnected: false },
      { id: '11', name: 'Light Bulb 11', lat: 10.8301, lng: 106.6367, isOn: false, isConnected: true },
      { id: '12', name: 'Light Bulb 12', lat: 10.8311, lng: 106.6377, isOn: true, isConnected: true },
    ],
  },
];
