
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import Map from '@/components/Map';
import VesselInfo from '@/components/VesselInfo';
import StatisticsPanel from '@/components/StatisticsPanel';
import TrendsPanel from '@/components/TrendsPanel';
import SearchPanel from '@/components/SearchPanel';
import { useMapData, MapMode } from '@/hooks/useMapData';
import { Button } from '@/components/ui/button';
import { Ship, MapIcon, BarChart4, Filter, CheckIcon, Clock, AlertTriangle } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';

const Index = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeTab, setActiveTab] = useState<'statistics' | 'trends' | 'search'>('search'); // Default to search tab
  
  const { 
    vessels,
    ports,
    routes,
    selectedVessel, 
    setSelectedVesselId,
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
    handleCalculatedRoute
  } = useMapData();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-116px)] flex w-full">
        {/* Sidebar */}
        <div className={`bg-white dark:bg-black/20 border-r transition-all duration-300 ease-in-out ${sidebarVisible ? 'w-96' : 'w-0 overflow-hidden'}`}>
          <div className="h-full flex flex-col p-4">
            {/* Top controls */}
            <div className="flex items-center space-x-2 mb-4">
              <Button 
                variant={activeTab === 'statistics' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => setActiveTab('statistics')}
              >
                <BarChart4 className="h-4 w-4 mr-2" />
                Statistics
              </Button>
              <Button 
                variant={activeTab === 'trends' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => setActiveTab('trends')}
              >
                <Clock className="h-4 w-4 mr-2" />
                Trends
              </Button>
              <Button 
                variant={activeTab === 'search' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => setActiveTab('search')}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            
            {/* Selected vessel info */}
            {selectedVessel && (
              <div className="mb-4 animate-fade-in">
                <VesselInfo vessel={selectedVessel} />
              </div>
            )}
            
            {/* Tab content */}
            <div className="flex-1 overflow-auto">
              {activeTab === 'statistics' && (
                <div className="animate-fade-in">
                  <StatisticsPanel vessels={vessels} />
                </div>
              )}
              
              {activeTab === 'trends' && (
                <div className="animate-fade-in">
                  <TrendsPanel vessels={vessels} />
                </div>
              )}
              
              {activeTab === 'search' && (
                <div className="animate-fade-in">
                  <SearchPanel 
                    query={query}
                    setQuery={setQuery}
                    searchResults={searchResults}
                    selectedOriginId={selectedOriginId}
                    setSelectedOriginId={setSelectedOriginId}
                    selectedDestinationId={selectedDestinationId}
                    setSelectedDestinationId={setSelectedDestinationId}
                    setSelectingOrigin={setSelectingOrigin}
                    setSelectingDestination={setSelectingDestination}
                    onCalculateRoute={handleCalculatedRoute}
                    ports={ports}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Map container */}
        <div className="flex-1 flex flex-col h-full relative">
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={toggleSidebar}
              className="bg-white/90 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70"
            >
              {sidebarVisible ? '← Hide Sidebar' : '→ Show Sidebar'}
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="bg-white/90 dark:bg-black/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-black/70"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Map Display</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={mapMode} onValueChange={(value) => setMapMode(value as MapMode)}>
                  <DropdownMenuRadioItem value="vessels">Vessels Only</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="routes">Routes Only</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="both">Show Both</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuLabel>Status Filter</DropdownMenuLabel>
                <DropdownMenuItem 
                  className="flex items-center"
                  onClick={() => setStatusFilter(undefined)}
                >
                  {!statusFilter && <CheckIcon className="h-4 w-4 mr-2" />}
                  <span className={!statusFilter ? 'font-medium' : ''}>All Vessels</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center"
                  onClick={() => setStatusFilter('ontime')}
                >
                  {statusFilter === 'ontime' && <CheckIcon className="h-4 w-4 mr-2" />}
                  <span className={statusFilter === 'ontime' ? 'font-medium' : ''}>On Time</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center"
                  onClick={() => setStatusFilter('delayed')}
                >
                  {statusFilter === 'delayed' && <CheckIcon className="h-4 w-4 mr-2" />}
                  <span className={statusFilter === 'delayed' ? 'font-medium' : ''}>Delayed</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center"
                  onClick={() => setStatusFilter('critical')}
                >
                  {statusFilter === 'critical' && <CheckIcon className="h-4 w-4 mr-2" />}
                  <span className={statusFilter === 'critical' ? 'font-medium' : ''}>Critical</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex-1 p-4">
            <Map 
              vessels={vessels}
              ports={ports}
              routes={routes}
              selectedVessel={selectedVessel}
              selectedRoute={selectedRoute}
              mapMode={mapMode}
              onVesselSelect={setSelectedVesselId}
              onPortSelect={handlePortSelect}
              selectingOrigin={selectingOrigin}
              selectingDestination={selectingDestination}
              className="h-full"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
