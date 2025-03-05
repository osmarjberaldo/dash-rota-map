
export interface Port {
  id: string;
  name: string;
  position: [number, number]; // [longitude, latitude]
  country: string;
}

export interface Route {
  id: string;
  origin: Port;
  destination: Port;
  waypoints: [number, number][]; // Array of [longitude, latitude] coordinates
  distance: number; // in nautical miles
  averageTime: number; // in hours
}

export const mockPorts: Port[] = [
  {
    id: 'p001',
    name: 'Rotterdam',
    position: [4.4, 51.9],
    country: 'Netherlands'
  },
  {
    id: 'p002',
    name: 'Antwerp',
    position: [4.4, 51.2],
    country: 'Belgium'
  },
  {
    id: 'p003',
    name: 'Hamburg',
    position: [10.0, 53.5],
    country: 'Germany'
  },
  {
    id: 'p004',
    name: 'London',
    position: [0.1, 51.5],
    country: 'United Kingdom'
  },
  {
    id: 'p005',
    name: 'Amsterdam',
    position: [4.9, 52.4],
    country: 'Netherlands'
  },
  {
    id: 'p006',
    name: 'Oslo',
    position: [10.8, 59.9],
    country: 'Norway'
  },
  {
    id: 'p007',
    name: 'Copenhagen',
    position: [12.6, 55.7],
    country: 'Denmark'
  },
  {
    id: 'p008',
    name: 'Dublin',
    position: [-6.3, 53.3],
    country: 'Ireland'
  },
  {
    id: 'p009',
    name: 'Le Havre',
    position: [0.1, 49.5],
    country: 'France'
  },
  {
    id: 'p010',
    name: 'Southampton',
    position: [-1.4, 50.9],
    country: 'United Kingdom'
  }
];

export const mockRoutes: Route[] = [
  {
    id: 'r001',
    origin: mockPorts.find(p => p.name === 'London')!,
    destination: mockPorts.find(p => p.name === 'Rotterdam')!,
    waypoints: [
      [0.1, 51.5], // London
      [1.5, 51.6], 
      [3.0, 51.8],
      [4.4, 51.9] // Rotterdam
    ],
    distance: 215,
    averageTime: 14
  },
  {
    id: 'r002',
    origin: mockPorts.find(p => p.name === 'Oslo')!,
    destination: mockPorts.find(p => p.name === 'Amsterdam')!,
    waypoints: [
      [10.8, 59.9], // Oslo
      [10.5, 58.0],
      [9.0, 57.0],
      [8.0, 55.5],
      [6.0, 54.0],
      [5.0, 53.0],
      [4.9, 52.4] // Amsterdam
    ],
    distance: 520,
    averageTime: 38
  },
  {
    id: 'r003',
    origin: mockPorts.find(p => p.name === 'Copenhagen')!,
    destination: mockPorts.find(p => p.name === 'Hamburg')!,
    waypoints: [
      [12.6, 55.7], // Copenhagen
      [12.0, 54.8],
      [11.0, 54.5],
      [10.0, 53.5] // Hamburg
    ],
    distance: 180,
    averageTime: 10
  },
  {
    id: 'r004',
    origin: mockPorts.find(p => p.name === 'Dublin')!,
    destination: mockPorts.find(p => p.name === 'Antwerp')!,
    waypoints: [
      [-6.3, 53.3], // Dublin
      [-5.0, 53.0],
      [-2.0, 52.0],
      [0.0, 51.5],
      [2.0, 51.3],
      [4.4, 51.2] // Antwerp
    ],
    distance: 685,
    averageTime: 45
  },
  {
    id: 'r005',
    origin: mockPorts.find(p => p.name === 'Southampton')!,
    destination: mockPorts.find(p => p.name === 'Le Havre')!,
    waypoints: [
      [-1.4, 50.9], // Southampton
      [-0.7, 50.5],
      [0.1, 49.5] // Le Havre
    ],
    distance: 120,
    averageTime: 8
  }
];

export const getRouteById = (id: string): Route | undefined => {
  return mockRoutes.find(route => route.id === id);
};

export const getRouteByPorts = (originId: string, destinationId: string): Route | undefined => {
  return mockRoutes.find(
    route => route.origin.id === originId && route.destination.id === destinationId
  );
};

export const getPortById = (id: string): Port | undefined => {
  return mockPorts.find(port => port.id === id);
};

export const getPortByName = (name: string): Port | undefined => {
  return mockPorts.find(port => port.name.toLowerCase() === name.toLowerCase());
};

export const searchPorts = (query: string): Port[] => {
  if (!query) return [];
  const lowerQuery = query.toLowerCase();
  return mockPorts.filter(
    port => port.name.toLowerCase().includes(lowerQuery) || 
           port.country.toLowerCase().includes(lowerQuery)
  );
};
