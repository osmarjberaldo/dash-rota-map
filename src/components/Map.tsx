import React, { useEffect, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline, 
  useMap,
  CircleMarker
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, DivIcon } from 'leaflet';
import { Vessel } from '@/data/mockVesselData';
import { Port, Route } from '@/data/mockRouteData';
import { MapMode } from '@/hooks/useMapData';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { ShipIcon } from 'lucide-react';

// @ts-ignore - leaflet types issue
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: icon,
  iconRetinaUrl: icon,
  shadowUrl: iconShadow,
});

interface MapProps {
  vessels: Vessel[];
  ports: Port[];
  routes: Route[];
  selectedVessel?: Vessel;
  selectedRoute?: Route;
  mapMode: MapMode;
  onVesselSelect: (vesselId: string) => void;
  onPortSelect?: (portId: string) => void;
  selectingOrigin?: boolean;
  selectingDestination?: boolean;
  className?: string;
}

// A component to handle map updates
const MapUpdater: React.FC<{ 
  selectedVessel?: Vessel, 
  selectedRoute?: Route
}> = ({ selectedVessel, selectedRoute }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedVessel) {
      map.setView(
        [selectedVessel.position[1], selectedVessel.position[0]], 
        8, 
        { animate: true }
      );
    } else if (selectedRoute) {
      // Create bounds for the route
      const lats = selectedRoute.waypoints.map(point => point[1]);
      const lngs = selectedRoute.waypoints.map(point => point[0]);
      
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      map.fitBounds([
        [minLat, minLng],
        [maxLat, maxLng]
      ], { padding: [50, 50], animate: true });
    }
  }, [map, selectedVessel, selectedRoute]);
  
  return null;
};

const Map: React.FC<MapProps> = ({
  vessels,
  ports,
  routes,
  selectedVessel,
  selectedRoute,
  mapMode,
  onVesselSelect,
  onPortSelect,
  selectingOrigin = false,
  selectingDestination = false,
  className = ''
}) => {
  // Get status color for a vessel
  const getStatusColor = (status: 'ontime' | 'delayed' | 'critical'): string => {
    switch (status) {
      case 'ontime': return 'hsl(var(--status-ontime))';
      case 'delayed': return 'hsl(var(--status-delayed))';
      case 'critical': return 'hsl(var(--status-critical))';
      default: return 'hsl(var(--status-ontime))';
    }
  };
  
  // Format date nicely
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  // Create vessel markers
  const vesselMarkers = mapMode === 'vessels' || mapMode === 'both' ? vessels.map(vessel => {
    const isSelected = selectedVessel?.id === vessel.id;
    const statusColor = getStatusColor(vessel.status);
    
    // Create a custom icon for vessels that looks like a ship
    const vesselIcon = new DivIcon({
      html: `<div style="
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        color: white;
        background-color: ${statusColor};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 8px rgba(0,0,0,0.2);
        transform: rotate(${vessel.heading}deg);
        transition: all 0.3s ease;
        ${isSelected ? 'transform: scale(1.2) rotate(' + vessel.heading + 'deg);' : ''}
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
          <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"></path>
          <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"></path>
        </svg>
      </div>`,
      className: 'vessel-marker-icon',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
    
    return (
      <Marker 
        key={vessel.id}
        position={[vessel.position[1], vessel.position[0]]}
        eventHandlers={{
          click: () => onVesselSelect(vessel.id)
        }}
      >
        <div className="vessel-marker-wrapper" style={{ display: 'none' }}>
          {/* This is a workaround to set the icon - the react-leaflet API changed */}
          {(() => {
            // @ts-ignore - we're applying the icon directly to the marker element
            const markerElement = document.querySelector(`[data-vessel-id="${vessel.id}"]`);
            if (markerElement) {
              // @ts-ignore - applying icon to leaflet marker instance
              markerElement._icon = vesselIcon;
            }
            return null;
          })()}
        </div>
        <Popup>
          <div className="vessel-popup-content">
            <h3 className="text-lg font-semibold">{vessel.name}</h3>
            <div className="flex items-center mt-1">
              <span 
                className={`inline-block w-3 h-3 rounded-full mr-2`}
                style={{ backgroundColor: statusColor }}
              ></span>
              <span className="text-sm capitalize">{vessel.status}</span>
              {vessel.delayTime && (
                <span className="text-sm ml-1">
                  ({vessel.delayTime} min)
                </span>
              )}
            </div>
            
            <div className="mt-3 space-y-1">
              <p className="text-sm">
                <span className="font-medium">From:</span> {vessel.origin}
              </p>
              <p className="text-sm">
                <span className="font-medium">To:</span> {vessel.destination}
              </p>
              <p className="text-sm">
                <span className="font-medium">ETA:</span> {formatDate(vessel.eta)}
              </p>
              <p className="text-sm">
                <span className="font-medium">Speed:</span> {vessel.speed} knots
              </p>
            </div>
            
            <div className="mt-3 flex justify-end">
              <button 
                className="text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // This would show more details in a real app
                  console.log(`View details for ${vessel.id}`);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  }) : [];

  // Create port markers
  const portMarkers = mapMode === 'routes' || mapMode === 'both' ? ports.map(port => {
    const isSelectable = selectingOrigin || selectingDestination;
    const fillColor = isSelectable ? '#2563EB' : '#4B5563';
    
    return (
      <CircleMarker
        key={port.id}
        center={[port.position[1], port.position[0]]}
        pathOptions={{
          fillColor,
          fillOpacity: 0.8,
          color: 'white',
          weight: 2,
          radius: 5
        }}
        eventHandlers={{
          click: () => {
            if (isSelectable && onPortSelect) {
              onPortSelect(port.id);
            }
          }
        }}
      >
        <Popup>
          <div className="vessel-popup-content">
            <h3 className="text-lg font-semibold">{port.name}</h3>
            <p className="text-sm">{port.country}</p>
            {isSelectable && (
              <button 
                className="mt-2 text-xs px-3 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onPortSelect) {
                    onPortSelect(port.id);
                  }
                }}
              >
                Select {selectingOrigin ? 'as Origin' : 'as Destination'}
              </button>
            )}
          </div>
        </Popup>
      </CircleMarker>
    );
  }) : [];

  // Create route lines
  const routeLines = mapMode === 'routes' || mapMode === 'both' ? routes.map(route => {
    const isSelected = selectedRoute?.id === route.id;
    const coordinates = route.waypoints.map(wp => [wp[1], wp[0]]);
    
    return (
      <Polyline
        key={route.id}
        positions={coordinates}
        pathOptions={{
          color: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--sea))',
          weight: isSelected ? 4 : 2,
          opacity: isSelected ? 1 : 0.7,
          dashArray: isSelected ? '' : '5, 5'
        }}
      >
        <Popup>
          <div className="vessel-popup-content">
            <h3 className="text-lg font-semibold">Route Details</h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <span className="font-medium">From:</span> {route.origin.name}, {route.origin.country}
              </p>
              <p className="text-sm">
                <span className="font-medium">To:</span> {route.destination.name}, {route.destination.country}
              </p>
              <p className="text-sm">
                <span className="font-medium">Distance:</span> {route.distance} nautical miles
              </p>
              <p className="text-sm">
                <span className="font-medium">Avg. Travel Time:</span> {route.averageTime} hours
              </p>
            </div>
          </div>
        </Popup>
      </Polyline>
    );
  }) : [];

  return (
    <div className={`w-full h-full rounded-lg overflow-hidden shadow-lg border ${className}`}>
      <MapContainer
        center={[52, 5]} // Center on Netherlands
        zoom={5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {vesselMarkers}
        {portMarkers}
        {routeLines}
        <MapUpdater 
          selectedVessel={selectedVessel} 
          selectedRoute={selectedRoute} 
        />
      </MapContainer>
    </div>
  );
};

export default Map;
