
import { useState, useEffect } from 'react';
import { 
  mockVessels, 
  Vessel,
  getVesselsByStatus 
} from '../data/mockVesselData';
import { 
  mockPorts, 
  mockRoutes, 
  Port, 
  Route,
  searchPorts,
  getPortById
} from '../data/mockRouteData';

export type MapMode = 'vessels' | 'routes' | 'both';

export interface UseMapDataProps {
  initialMode?: MapMode;
  initialSelectedVesselId?: string;
  initialStatusFilter?: 'ontime' | 'delayed' | 'critical' | undefined;
}

export function useMapData({ 
  initialMode = 'both',
  initialSelectedVesselId,
  initialStatusFilter
}: UseMapDataProps = {}) {
  const [mapMode, setMapMode] = useState<MapMode>(initialMode);
  const [selectedVesselId, setSelectedVesselId] = useState<string | undefined>(initialSelectedVesselId);
  const [statusFilter, setStatusFilter] = useState<'ontime' | 'delayed' | 'critical' | undefined>(initialStatusFilter);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Port[]>([]);
  
  const [selectedOriginId, setSelectedOriginId] = useState<string | undefined>();
  const [selectedDestinationId, setSelectedDestinationId] = useState<string | undefined>();
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>();
  const [calculatedRoute, setCalculatedRoute] = useState<{
    waypoints: [number, number][];
    distance: number;
    duration: number;
  } | null>(null);
  
  const [selectingOrigin, setSelectingOrigin] = useState(false);
  const [selectingDestination, setSelectingDestination] = useState(false);
  
  // Filter vessels based on status
  const filteredVessels = statusFilter 
    ? getVesselsByStatus(statusFilter)
    : mockVessels;
  
  // Get the selected vessel
  const selectedVessel = selectedVesselId 
    ? filteredVessels.find(v => v.id === selectedVesselId)
    : undefined;

  // Handle search
  useEffect(() => {
    if (query.length > 1) {
      const results = searchPorts(query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [query]);

  // Update selected route when origin and destination change
  useEffect(() => {
    if (selectedOriginId && selectedDestinationId) {
      const route = mockRoutes.find(
        r => r.origin.id === selectedOriginId && r.destination.id === selectedDestinationId
      );
      setSelectedRoute(route);
    } else {
      setSelectedRoute(undefined);
    }
  }, [selectedOriginId, selectedDestinationId]);
  
  // Handle port selection on map
  const handlePortSelect = (portId: string) => {
    if (selectingOrigin) {
      setSelectedOriginId(portId);
      setSelectingOrigin(false);
    } else if (selectingDestination) {
      setSelectedDestinationId(portId);
      setSelectingDestination(false);
    }
  };
  
  // Handle calculated route from Sea Route API
  const handleCalculatedRoute = (
    waypoints: [number, number][], 
    distance: number, 
    duration: number
  ) => {
    if (selectedOriginId && selectedDestinationId) {
      const origin = getPortById(selectedOriginId);
      const destination = getPortById(selectedDestinationId);
      
      if (origin && destination) {
        // Create a custom route from the calculated data
        const calculatedRoute: Route = {
          id: `calculated-${origin.id}-${destination.id}`,
          origin,
          destination,
          waypoints,
          distance,
          averageTime: duration
        };
        
        setSelectedRoute(calculatedRoute);
        setCalculatedRoute({
          waypoints,
          distance,
          duration
        });
        
        // Switch to routes mode to show the calculated route
        if (mapMode === 'vessels') {
          setMapMode('both');
        }
      }
    }
  };

  // Simulate vessels moving every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // This would normally be a fetch to an API to get updated vessel positions
      // For the mock, we'll just slightly change positions to simulate movement
      mockVessels.forEach(vessel => {
        // Add small random movement based on heading
        const headingRad = (vessel.heading * Math.PI) / 180;
        const speedFactor = vessel.speed / 200; // Scale down for small movements
        
        vessel.position = [
          vessel.position[0] + Math.sin(headingRad) * speedFactor,
          vessel.position[1] + Math.cos(headingRad) * speedFactor
        ];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return {
    vessels: filteredVessels,
    selectedVessel,
    setSelectedVesselId,
    ports: mockPorts,
    routes: selectedRoute && calculatedRoute ? [...mockRoutes, selectedRoute] : mockRoutes,
    selectedRoute,
    mapMode,
    setMapMode,
    statusFilter,
    setStatusFilter,
    query,
    setQuery,
    searchResults,
    selectedOriginId,
    setSelectedOriginId,
    selectedDestinationId,
    setSelectedDestinationId,
    selectingOrigin,
    setSelectingOrigin,
    selectingDestination,
    setSelectingDestination,
    handlePortSelect,
    handleCalculatedRoute,
    calculatedRoute
  };
}
