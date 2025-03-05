
import React from 'react';
import { Vessel } from '@/data/mockVesselData';
import { Ship, Clock, Navigation, Anchor, MapPin, AlertTriangle } from 'lucide-react';

interface VesselInfoProps {
  vessel: Vessel;
  className?: string;
}

const VesselInfo: React.FC<VesselInfoProps> = ({ vessel, className = '' }) => {
  // Format date nicely
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  // Get status color and icon
  const getStatusInfo = (status: 'ontime' | 'delayed' | 'critical') => {
    switch (status) {
      case 'ontime': 
        return { 
          color: 'bg-status-ontime/10 text-status-ontime border-status-ontime/20',
          text: 'On Time'
        };
      case 'delayed': 
        return { 
          color: 'bg-status-delayed/10 text-status-delayed border-status-delayed/20',
          text: 'Delayed'
        };
      case 'critical': 
        return { 
          color: 'bg-status-critical/10 text-status-critical border-status-critical/20',
          text: 'Critical Delay'
        };
      default: 
        return { 
          color: 'bg-status-ontime/10 text-status-ontime border-status-ontime/20',
          text: 'On Time'
        };
    }
  };

  const statusInfo = getStatusInfo(vessel.status);

  return (
    <div className={`bg-white dark:bg-black/20 rounded-lg shadow-lg border p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Ship className="w-5 h-5 text-sea" />
            <h2 className="text-lg font-semibold">{vessel.name}</h2>
          </div>
          <div className="mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
              {vessel.status === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {statusInfo.text}
              {vessel.delayTime && <span className="ml-1">({vessel.delayTime} min)</span>}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Vessel ID</p>
          <p className="font-mono text-xs">{vessel.id}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="flex items-center text-muted-foreground text-sm">
            <Anchor className="w-4 h-4 mr-2" />
            <span>Origin</span>
          </div>
          <p className="font-medium text-sm">{vessel.origin}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            <span>Destination</span>
          </div>
          <p className="font-medium text-sm">{vessel.destination}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span>ETA</span>
          </div>
          <p className="font-medium text-sm">{formatDate(vessel.eta)}</p>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center text-muted-foreground text-sm">
            <Navigation className="w-4 h-4 mr-2" />
            <span>Current Position</span>
          </div>
          <p className="font-medium text-sm font-mono">
            {vessel.position[1].toFixed(4)}, {vessel.position[0].toFixed(4)}
          </p>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium">Speed</h3>
            <p className="text-2xl font-semibold mt-1">{vessel.speed} <span className="text-sm font-normal text-muted-foreground">knots</span></p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Heading</h3>
            <p className="text-2xl font-semibold mt-1">{vessel.heading}° <span className="text-sm font-normal text-muted-foreground">degrees</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VesselInfo;
