
import React from 'react';
import { Card } from '@/components/ui/card';
import { Vessel } from '@/data/mockVesselData';
import { ShipIcon, ClockIcon, AnchorIcon, MapPinIcon, ArrowRightIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

interface StatisticsPanelProps {
  vessels: Vessel[];
  className?: string;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ vessels, className = '' }) => {
  // Calculate statistics
  const totalVessels = vessels.length;
  const onTimeVessels = vessels.filter(v => v.status === 'ontime').length;
  const delayedVessels = vessels.filter(v => v.status === 'delayed').length;
  const criticalVessels = vessels.filter(v => v.status === 'critical').length;
  
  const onTimePercentage = Math.round((onTimeVessels / totalVessels) * 100);
  const avgSpeed = vessels.reduce((acc, v) => acc + v.speed, 0) / totalVessels;
  
  return (
    <div className={`space-y-5 ${className}`}>
      <h2 className="text-lg font-semibold">Fleet Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex items-center space-x-4 bg-white dark:bg-black/20">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShipIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Active Vessels</h3>
            <p className="text-2xl font-semibold">{totalVessels}</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4 bg-white dark:bg-black/20">
          <div className="h-12 w-12 rounded-full bg-status-ontime/10 flex items-center justify-center">
            <CheckCircleIcon className="h-6 w-6 text-status-ontime" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">On-Time</h3>
            <p className="text-2xl font-semibold">{onTimePercentage}%</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center space-x-4 bg-white dark:bg-black/20">
          <div className="h-12 w-12 rounded-full bg-status-delayed/10 flex items-center justify-center">
            <AlertTriangleIcon className="h-6 w-6 text-status-delayed" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Delayed</h3>
            <p className="text-2xl font-semibold">{delayedVessels + criticalVessels}</p>
          </div>
        </Card>
      </div>
      
      <Card className="p-5 bg-white dark:bg-black/20">
        <h3 className="text-sm font-medium mb-4">Vessel Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-status-ontime"></span>
              <span className="text-sm">On Time</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{onTimeVessels}</span>
              <span className="text-xs text-muted-foreground">vessels</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-status-delayed"></span>
              <span className="text-sm">Delayed</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{delayedVessels}</span>
              <span className="text-xs text-muted-foreground">vessels</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-status-critical"></span>
              <span className="text-sm">Critical</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{criticalVessels}</span>
              <span className="text-xs text-muted-foreground">vessels</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm">Average Speed</span>
            <span className="text-sm font-medium">{avgSpeed.toFixed(1)} knots</span>
          </div>
        </div>
      </Card>
      
      {criticalVessels > 0 && (
        <Card className="p-5 border-status-critical/20 bg-status-critical/5">
          <div className="flex items-start space-x-3">
            <AlertTriangleIcon className="h-5 w-5 text-status-critical shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-status-critical">Critical Delays Alert</h3>
              <p className="text-sm mt-1 text-muted-foreground">
                {criticalVessels} {criticalVessels === 1 ? 'vessel has' : 'vessels have'} reported critical delays. 
                This may impact your scheduled operations.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StatisticsPanel;
