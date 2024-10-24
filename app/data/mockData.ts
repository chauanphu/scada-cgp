import { District } from '@/types/lightTypes';

export const mockDistricts: District[] = [
  {
    id: '1',
    name: 'Nguyễn Thị Minh Khai, Quận 1',
    lat: 10.7767,
    lng: 106.6956,
    numberOfLights: 3,
    lightBulbs: [
      {
        id: '1',
        name: 'Nguyễn Thị Minh Khai 1',
        lat: 10.7768,
        lng: 106.6955,
        isOn: true,
        isConnected: true,
        powerUsage: 100,
        voltage: 220,
        amperage: 0.45,
        schedule: { on: '18:00', off: '06:00' },
      },
      {
        id: '2',
        name: 'Nguyễn Thị Minh Khai 2',
        lat: 10.7750,
        lng: 106.6960,
        isOn: false,
        isConnected: true,
        powerUsage: 80,
        voltage: 220,
        amperage: 0.36,
        schedule: { on: '19:00', off: '05:00' },
      },
      {
        id: '3',
        name: 'Nguyễn Thị Minh Khai 3',
        lat: 10.7775,
        lng: 106.6945,
        isOn: true,
        isConnected: false,
        powerUsage: 60,
        voltage: 220,
        amperage: 0.27,
        schedule: { on: '17:30', off: '06:30' },
      },
    ],
  },
  {
    id: '2',
    name: 'Trần Quốc Thảo, Quận 3',
    lat: 10.7762,
    lng: 106.6890,
    numberOfLights: 3,
    lightBulbs: [
      {
        id: '4',
        name: 'Trần Quốc Thảo 1',
        lat: 10.7763,
        lng: 106.6888,
        isOn: true,
        isConnected: true,
        powerUsage: 110,
        voltage: 220,
        amperage: 0.50,
        schedule: { on: '18:30', off: '05:30' },
      },
      {
        id: '5',
        name: 'Trần Quốc Thảo 2',
        lat: 10.7745,
        lng: 106.6895,
        isOn: false,
        isConnected: true,
        powerUsage: 75,
        voltage: 220,
        amperage: 0.34,
        schedule: { on: '20:00', off: '04:00' },
      },
      {
        id: '6',
        name: 'Trần Quốc Thảo 3',
        lat: 10.7755,
        lng: 106.6875,
        isOn: true,
        isConnected: false,
        powerUsage: 90,
        voltage: 220,
        amperage: 0.41,
        schedule: { on: '16:00', off: '07:00' },
      },
    ],
  },
  {
    id: '3',
    name: 'Hùng Vương, Quận 5',
    lat: 10.7569,
    lng: 106.6680,
    numberOfLights: 3,
    lightBulbs: [
      {
        id: '7',
        name: 'Hùng Vương 1',
        lat: 10.7572,
        lng: 106.6670,
        isOn: false,
        isConnected: true,
        powerUsage: 95,
        voltage: 220,
        amperage: 0.43,
        schedule: { on: '17:00', off: '05:00' },
      },
      {
        id: '8',
        name: 'Hùng Vương 2',
        lat: 10.7582,
        lng: 106.6685,
        isOn: true,
        isConnected: true,
        powerUsage: 120,
        voltage: 220,
        amperage: 0.55,
        schedule: { on: '18:00', off: '06:00' },
      },
      {
        id: '9',
        name: 'Hùng Vương 3',
        lat: 10.7565,
        lng: 106.6665,
        isOn: false,
        isConnected: true,
        powerUsage: 85,
        voltage: 220,
        amperage: 0.39,
        schedule: { on: '19:00', off: '05:00' },
      },
    ],
  },
  {
    id: '4',
    name: 'Lý Thường Kiệt, Quận 10',
    lat: 10.7630,
    lng: 106.6540,
    numberOfLights: 3,
    lightBulbs: [
      {
        id: '10',
        name: 'Lý Thường Kiệt 1',
        lat: 10.7622,
        lng: 106.6530,
        isOn: true,
        isConnected: true,
        powerUsage: 105,
        voltage: 220,
        amperage: 0.48,
        schedule: { on: '16:30', off: '06:30' },
      },
      {
        id: '11',
        name: 'Lý Thường Kiệt 2',
        lat: 10.7635,
        lng: 106.6540,
        isOn: false,
        isConnected: true,
        powerUsage: 70,
        voltage: 220,
        amperage: 0.32,
        schedule: { on: '20:00', off: '04:00' },
      },
      {
        id: '12',
        name: 'Lý Thường Kiệt 3',
        lat: 10.7641,
        lng: 106.6550,
        isOn: true,
        isConnected: true,
        powerUsage: 125,
        voltage: 220,
        amperage: 0.57,
        schedule: { on: '17:00', off: '07:00' },
      },
    ],
  },
];
