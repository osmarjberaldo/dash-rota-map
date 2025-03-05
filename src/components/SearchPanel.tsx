
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ship, Search, MapPin, Navigation, ArrowRight, Loader2 } from 'lucide-react';
import { Port } from '@/data/mockRouteData';
import { calculateSeaRoute } from '@/services/seaRouteApi';
import { useToast } from '@/hooks/use-toast';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  searchResults: Port[];
  selectedOriginId?: string;
  setSelectedOriginId: (id: string | undefined) => void;
  selectedDestinationId?: string;
  setSelectedDestinationId: (id: string | undefined) => void;
  onCalculateRoute: (waypoints: [number, number][], distance: number, duration: number) => void;
  setSelectingOrigin: (selecting: boolean) => void;
  setSelectingDestination: (selecting: boolean) => void;
  className?: string;
  ports: Port[];
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  searchResults,
  selectedOriginId,
  setSelectedOriginId,
  selectedDestinationId,
  setSelectedDestinationId,
  onCalculateRoute,
  setSelectingOrigin,
  setSelectingDestination,
  className = '',
  ports
}) => {
  const [searchMode, setSearchMode] = useState<'origin' | 'destination'>('origin');
  const [isCalculating, setIsCalculating] = useState(false);
  const [shipSpeed, setShipSpeed] = useState(14); // Default speed in knots
  const { toast } = useToast();
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleSelectPort = (port: Port) => {
    if (searchMode === 'origin') {
      setSelectedOriginId(port.id);
      setSearchMode('destination');
      setQuery('');
    } else {
      setSelectedDestinationId(port.id);
      setQuery('');
    }
  };
  
  const handleClear = () => {
    setSelectedOriginId(undefined);
    setSelectedDestinationId(undefined);
    setQuery('');
    setSearchMode('origin');
  };
  
  const getPortById = (id?: string): Port | undefined => {
    if (!id) return undefined;
    return ports.find(port => port.id === id);
  };
  
  const handleSelectOnMap = (type: 'origin' | 'destination') => {
    if (type === 'origin') {
      setSelectingOrigin(true);
      setSelectingDestination(false);
    } else {
      setSelectingOrigin(false);
      setSelectingDestination(true);
    }
    
    toast({
      title: `Select ${type} port`,
      description: `Click on a port on the map to select it as the ${type}.`,
      duration: 3000,
    });
  };
  
  const handleCalculateRoute = async () => {
    const originPort = getPortById(selectedOriginId);
    const destinationPort = getPortById(selectedDestinationId);
    
    if (!originPort || !destinationPort) {
      toast({
        title: "Missing ports",
        description: "Please select both origin and destination ports",
        variant: "destructive"
      });
      return;
    }
    
    setIsCalculating(true);
    
    try {
      const result = await calculateSeaRoute({
        originLon: originPort.position[0],
        originLat: originPort.position[1],
        destinationLon: destinationPort.position[0],
        destinationLat: destinationPort.position[1],
        speed: shipSpeed
      });
      
      if (result.status === 'success') {
        onCalculateRoute(result.waypoints, result.distance, result.duration);
        
        toast({
          title: "Route calculated",
          description: `Distance: ${result.distance.toFixed(1)} nautical miles, Est. time: ${result.duration.toFixed(1)} hours`,
        });
      } else {
        toast({
          title: "Calculation failed",
          description: result.error || "Could not calculate route",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to calculate the route",
        variant: "destructive"
      });
    } finally {
      setIsCalculating(false);
    }
  };
  
  const originPort = getPortById(selectedOriginId);
  const destinationPort = getPortById(selectedDestinationId);

  return (
    <Card className={`p-5 bg-white dark:bg-black/20 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Route Search</h2>
      
      <div className="mb-4 flex flex-col space-y-3 w-full">
        {/* Origin Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Origin</p>
              {originPort ? (
                <p className="text-sm font-medium">{originPort.name}, {originPort.country}</p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">Not selected</p>
              )}
            </div>
          </div>
          <Button 
            size="sm" 
            variant={originPort ? "ghost" : "outline"} 
            onClick={() => {
              if (originPort) {
                setSelectedOriginId(undefined);
              } else {
                setSearchMode('origin');
                handleSelectOnMap('origin');
              }
            }}
            className="h-6 px-2"
          >
            {originPort ? 'Change' : 'Select'}
          </Button>
        </div>
            
        {/* Destination Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
              <Navigation className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destination</p>
              {destinationPort ? (
                <p className="text-sm font-medium">{destinationPort.name}, {destinationPort.country}</p>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">Not selected</p>
              )}
            </div>
          </div>
          <Button 
            size="sm" 
            variant={destinationPort ? "ghost" : "outline"} 
            onClick={() => {
              if (destinationPort) {
                setSelectedDestinationId(undefined);
              } else {
                setSearchMode('destination');
                handleSelectOnMap('destination');
              }
            }}
            className="h-6 px-2"
          >
            {destinationPort ? 'Change' : 'Select'}
          </Button>
        </div>
        
        {/* Calculate Route Section - Only show when both ports are selected */}
        {originPort && destinationPort && (
          <div className="pt-2">
            <div className="flex items-center space-x-2 mb-2">
              <label htmlFor="shipSpeed" className="text-sm">Ship Speed (knots):</label>
              <Input
                id="shipSpeed"
                type="number"
                min="1"
                max="50"
                value={shipSpeed}
                onChange={(e) => setShipSpeed(Number(e.target.value))}
                className="w-20 h-8 py-1"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleCalculateRoute}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating Route...
                </>
              ) : (
                <>
                  <Ship className="mr-2 h-4 w-4" />
                  Calculate Route
                </>
              )}
            </Button>
          </div>
        )}
        
        {/* Clear Selection */}
        {(originPort || destinationPort) && (
          <div className="pt-1">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleClear}
              className="w-full"
            >
              Clear Selection
            </Button>
          </div>
        )}
      </div>
      
      {/* Search by Name */}
      {(!originPort || !destinationPort) && (
        <>
          <div className="text-center text-sm text-muted-foreground mb-3">
            Search for {searchMode === 'origin' ? 'origin' : 'destination'} port
          </div>
          <div className="relative">
            <Input
              className="pl-10"
              placeholder={`Search for ${searchMode === 'origin' ? 'origin' : 'destination'} port...`}
              value={query}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </>
      )}
      
      {query.length > 1 && searchResults.length > 0 && (
        <div className="mt-2 max-h-48 overflow-y-auto border rounded-md shadow-sm">
          {searchResults.map(port => (
            <button
              key={port.id}
              className="w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center space-x-2"
              onClick={() => handleSelectPort(port)}
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{port.name}</p>
                <p className="text-xs text-muted-foreground">{port.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {query.length > 1 && searchResults.length === 0 && (
        <div className="mt-2 p-3 text-center text-sm text-muted-foreground">
          No ports found. Try a different search term.
        </div>
      )}
      
      {!query && !originPort && !destinationPort && (
        <div className="mt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mb-2"
            onClick={() => handleSelectOnMap('origin')}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Select Origin Port on Map
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => handleSelectOnMap('destination')}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Select Destination Port on Map
          </Button>
        </div>
      )}
    </Card>
  );
};

export default SearchPanel;
