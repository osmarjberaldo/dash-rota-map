
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Ship, Search, MapPin, Navigation, ArrowRight } from 'lucide-react';
import { Port } from '@/data/mockRouteData';

interface SearchPanelProps {
  query: string;
  setQuery: (query: string) => void;
  searchResults: Port[];
  selectedOriginId?: string;
  setSelectedOriginId: (id: string | undefined) => void;
  selectedDestinationId?: string;
  setSelectedDestinationId: (id: string | undefined) => void;
  className?: string;
}

const SearchPanel: React.FC<SearchPanelProps> = ({
  query,
  setQuery,
  searchResults,
  selectedOriginId,
  setSelectedOriginId,
  selectedDestinationId,
  setSelectedDestinationId,
  className = ''
}) => {
  const [searchMode, setSearchMode] = useState<'origin' | 'destination'>('origin');
  
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
    return searchResults.find(port => port.id === id) || undefined;
  };
  
  const originPort = getPortById(selectedOriginId);
  const destinationPort = getPortById(selectedDestinationId);

  return (
    <Card className={`p-5 bg-white dark:bg-black/20 ${className}`}>
      <h2 className="text-lg font-semibold mb-4">Route Search</h2>
      
      {(originPort || destinationPort) && (
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {originPort && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Origin</p>
                  <p className="text-sm font-medium">{originPort.name}, {originPort.country}</p>
                </div>
              </div>
            )}
            
            {originPort && destinationPort && (
              <ArrowRight className="w-4 h-4 text-muted-foreground mx-2" />
            )}
            
            {destinationPort && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <Navigation className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Destination</p>
                  <p className="text-sm font-medium">{destinationPort.name}, {destinationPort.country}</p>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      )}
      
      <div className="relative">
        <Input
          className="pl-10"
          placeholder={`Search for ${searchMode === 'origin' ? 'origin' : 'destination'} port...`}
          value={query}
          onChange={handleSearch}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>
      
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
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {searchMode === 'origin' ? 'Select origin port' : 'Select destination port'}
        </div>
        
        {selectedOriginId && selectedDestinationId && (
          <Button size="sm" className="px-3">
            <Ship className="mr-2 h-4 w-4" />
            Find Route
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SearchPanel;
