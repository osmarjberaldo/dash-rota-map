
export interface Vessel {
  id: string;
  name: string;
  type: 'cargo' | 'tanker' | 'passenger' | 'fishing';
  position: [number, number]; // [longitude, latitude]
  speed: number; // in knots
  heading: number; // in degrees
  eta: string; // ISO date string
  destination: string;
  origin: string;
  status: 'ontime' | 'delayed' | 'critical';
  delayTime?: number; // in minutes
}

export const mockVessels: Vessel[] = [
  {
    id: 'v001',
    name: 'Aurora Spirit',
    type: 'cargo',
    position: [3.7, 51.2],
    speed: 14.5,
    heading: 45,
    eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    destination: 'Rotterdam',
    origin: 'London',
    status: 'ontime'
  },
  {
    id: 'v002',
    name: 'Ocean Pioneer',
    type: 'tanker',
    position: [4.4, 52.0],
    speed: 12.2,
    heading: 120,
    eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    destination: 'Amsterdam',
    origin: 'Oslo',
    status: 'delayed',
    delayTime: 45
  },
  {
    id: 'v003',
    name: 'Nordic Queen',
    type: 'passenger',
    position: [7.5, 53.5],
    speed: 18.7,
    heading: 270,
    eta: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    destination: 'Hamburg',
    origin: 'Copenhagen',
    status: 'critical',
    delayTime: 180
  },
  {
    id: 'v004',
    name: 'Atlantic Voyager',
    type: 'cargo',
    position: [5.8, 50.8],
    speed: 15.3,
    heading: 90,
    eta: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    destination: 'Antwerp',
    origin: 'Dublin',
    status: 'ontime'
  },
  {
    id: 'v005',
    name: 'Global Horizon',
    type: 'tanker',
    position: [2.5, 51.5],
    speed: 11.8,
    heading: 150,
    eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    destination: 'Le Havre',
    origin: 'Southampton',
    status: 'delayed',
    delayTime: 90
  }
];

export const getVesselById = (id: string): Vessel | undefined => {
  return mockVessels.find(vessel => vessel.id === id);
};

export const getVesselsByStatus = (status?: 'ontime' | 'delayed' | 'critical'): Vessel[] => {
  if (!status) return mockVessels;
  return mockVessels.filter(vessel => vessel.status === status);
};
