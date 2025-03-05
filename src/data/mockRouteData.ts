
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

// Updated with 25 major global ports
export const mockPorts: Port[] = [
  // Asia
  {
    id: 'p001',
    name: 'Shanghai',
    position: [121.4737, 31.2304],
    country: 'China'
  },
  {
    id: 'p002',
    name: 'Singapore',
    position: [103.8198, 1.3521],
    country: 'Singapore'
  },
  {
    id: 'p003',
    name: 'Hong Kong',
    position: [114.1694, 22.3193],
    country: 'China'
  },
  {
    id: 'p004',
    name: 'Busan',
    position: [129.0403, 35.1796],
    country: 'South Korea'
  },
  {
    id: 'p005',
    name: 'Dubai',
    position: [55.2708, 25.2048],
    country: 'UAE'
  },
  
  // Europe
  {
    id: 'p006',
    name: 'Rotterdam',
    position: [4.4, 51.9],
    country: 'Netherlands'
  },
  {
    id: 'p007',
    name: 'Antwerp',
    position: [4.4, 51.2],
    country: 'Belgium'
  },
  {
    id: 'p008',
    name: 'Hamburg',
    position: [10.0, 53.5],
    country: 'Germany'
  },
  {
    id: 'p009',
    name: 'Valencia',
    position: [-0.3239, 39.4699],
    country: 'Spain'
  },
  {
    id: 'p010',
    name: 'Piraeus',
    position: [23.6351, 37.9422],
    country: 'Greece'
  },
  
  // Americas
  {
    id: 'p011',
    name: 'Los Angeles',
    position: [-118.2437, 33.7295],
    country: 'USA'
  },
  {
    id: 'p012',
    name: 'New York',
    position: [-74.0060, 40.7128],
    country: 'USA'
  },
  {
    id: 'p013',
    name: 'Vancouver',
    position: [-123.1207, 49.2827],
    country: 'Canada'
  },
  {
    id: 'p014',
    name: 'Santos',
    position: [-46.3053, -23.9535],
    country: 'Brazil'
  },
  {
    id: 'p015',
    name: 'Panama Canal',
    position: [-79.9191, 9.0820],
    country: 'Panama'
  },
  
  // Africa & Middle East
  {
    id: 'p016',
    name: 'Durban',
    position: [31.0218, -29.8587],
    country: 'South Africa'
  },
  {
    id: 'p017',
    name: 'Tangier',
    position: [-5.8129, 35.7595],
    country: 'Morocco'
  },
  {
    id: 'p018',
    name: 'Alexandria',
    position: [29.9187, 31.2001],
    country: 'Egypt'
  },
  
  // Oceania
  {
    id: 'p019',
    name: 'Sydney',
    position: [151.2093, -33.8688],
    country: 'Australia'
  },
  {
    id: 'p020',
    name: 'Melbourne',
    position: [144.9631, -37.8136],
    country: 'Australia'
  },
  {
    id: 'p021',
    name: 'Auckland',
    position: [174.7633, -36.8485],
    country: 'New Zealand'
  },
  
  // Additional major ports
  {
    id: 'p022',
    name: 'Tokyo',
    position: [139.6917, 35.6895],
    country: 'Japan'
  },
  {
    id: 'p023',
    name: 'Mumbai',
    position: [72.8777, 19.0760],
    country: 'India'
  },
  {
    id: 'p024',
    name: 'Houston',
    position: [-95.3698, 29.7604],
    country: 'USA'
  },
  {
    id: 'p025',
    name: 'Colombo',
    position: [79.8612, 6.9271],
    country: 'Sri Lanka'
  }
];

// Remove existing routes as they don't represent realistic sea routes
export const mockRoutes: Route[] = [];

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
