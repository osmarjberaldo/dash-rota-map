
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Vessel } from '@/data/mockVesselData';

interface TrendsPanelProps {
  vessels: Vessel[];
  className?: string;
}

// Mock historical ETA data (in a real app this would come from an API)
const etaHistoryData = [
  { date: 'Jan', ontime: 85, delayed: 12, critical: 3 },
  { date: 'Feb', ontime: 82, delayed: 15, critical: 3 },
  { date: 'Mar', ontime: 78, delayed: 18, critical: 4 },
  { date: 'Apr', ontime: 75, delayed: 20, critical: 5 },
  { date: 'May', ontime: 72, delayed: 21, critical: 7 },
  { date: 'Jun', ontime: 70, delayed: 22, critical: 8 },
  { date: 'Jul', ontime: 73, delayed: 21, critical: 6 },
  { date: 'Aug', ontime: 76, delayed: 19, critical: 5 },
  { date: 'Sep', ontime: 80, delayed: 16, critical: 4 },
  { date: 'Oct', ontime: 83, delayed: 14, critical: 3 },
  { date: 'Nov', ontime: 85, delayed: 12, critical: 3 },
  { date: 'Dec', ontime: 87, delayed: 10, critical: 3 },
];

// Mock vessel performance data
const vesselPerformanceData = [
  { name: 'Aurora Spirit', planned: 14, actual: 14.5 },
  { name: 'Ocean Pioneer', planned: 13.5, actual: 12.2 },
  { name: 'Nordic Queen', planned: 17, actual: 18.7 },
  { name: 'Atlantic Voyager', planned: 15, actual: 15.3 },
  { name: 'Global Horizon', planned: 12.5, actual: 11.8 },
];

// Mock delay impact data
const delayImpactData = [
  { name: 'Loading', value: 35 },
  { name: 'Unloading', value: 25 },
  { name: 'Maintenance', value: 15 },
  { name: 'Crew Change', value: 10 },
  { name: 'Other', value: 15 },
];

const COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--sea))', 
  'hsl(var(--status-delayed))', 
  'hsl(var(--status-critical))',
  'hsl(var(--muted-foreground))'
];

const TrendsPanel: React.FC<TrendsPanelProps> = ({ vessels, className = '' }) => {
  return (
    <div className={`space-y-5 ${className}`}>
      <h2 className="text-lg font-semibold">Performance Trends</h2>
      
      <Tabs defaultValue="eta">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="eta">ETA Trends</TabsTrigger>
          <TabsTrigger value="performance">Vessel Performance</TabsTrigger>
          <TabsTrigger value="impact">Delay Impact</TabsTrigger>
        </TabsList>
        
        <TabsContent value="eta" className="mt-4">
          <Card className="p-5 bg-white dark:bg-black/20">
            <h3 className="text-sm font-medium mb-4">Yearly ETA Trends</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={etaHistoryData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    unit="%"
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ 
                      borderRadius: '0.375rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line 
                    type="monotone" 
                    dataKey="ontime" 
                    name="On Time" 
                    stroke="hsl(var(--status-ontime))" 
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="delayed" 
                    name="Delayed" 
                    stroke="hsl(var(--status-delayed))" 
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="critical" 
                    name="Critical" 
                    stroke="hsl(var(--status-critical))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4">
          <Card className="p-5 bg-white dark:bg-black/20">
            <h3 className="text-sm font-medium mb-4">Planned vs Actual Speed</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={vesselPerformanceData}
                  margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                  barGap={0}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    angle={-35}
                    textAnchor="end"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                    unit=" knots"
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} knots`, '']}
                    contentStyle={{ 
                      borderRadius: '0.375rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    dataKey="planned" 
                    name="Planned Speed" 
                    fill="hsl(var(--muted-foreground))" 
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="actual" 
                    name="Actual Speed" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="impact" className="mt-4">
          <Card className="p-5 bg-white dark:bg-black/20">
            <h3 className="text-sm font-medium mb-4">Delay Impact on Operations</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={delayImpactData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {delayImpactData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, '']}
                    contentStyle={{ 
                      borderRadius: '0.375rem',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendsPanel;
