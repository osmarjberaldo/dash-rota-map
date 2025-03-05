
/**
 * Sea Route API service for calculating maritime routes
 */

const SEA_ROUTE_API_KEY = "Ge6iw57Uqh79eGtM5FMeQ9wgzVwoxdWk31qKP8t6";
const API_BASE_URL = "https://api.searoutes.com/route/v2/sea";

export interface RouteCalculationParams {
  originLon: number;
  originLat: number;
  destinationLon: number;
  destinationLat: number;
  speed?: number; // speed in knots, defaults to 14 if not provided
}

export interface RouteCalculationResult {
  status: 'success' | 'error';
  distance: number; // in nautical miles
  duration: number; // in hours
  waypoints: [number, number][]; // [longitude, latitude] pairs
  error?: string;
}

/**
 * Calculate a sea route between two points
 */
export const calculateSeaRoute = async (params: RouteCalculationParams): Promise<RouteCalculationResult> => {
  try {
    const { originLon, originLat, destinationLon, destinationLat, speed = 14 } = params;
    
    // Construct the URL for the Sea Route API
    const url = `${API_BASE_URL}/${originLon},${originLat};${destinationLon},${destinationLat}?speed=${speed}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': SEA_ROUTE_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Sea Route API error:', errorData);
      return {
        status: 'error',
        distance: 0,
        duration: 0,
        waypoints: [],
        error: errorData.message || 'Failed to calculate route'
      };
    }
    
    const data = await response.json();
    
    // Extract waypoints from the GeoJSON response
    const waypoints = data.geometry.coordinates.map((coord: number[]) => 
      [coord[0], coord[1]] as [number, number]
    );
    
    // Calculate duration based on distance and speed
    const distance = data.properties.distance; // in nautical miles
    const duration = distance / speed; // hours = nautical miles / knots
    
    return {
      status: 'success',
      distance,
      duration,
      waypoints
    };
  } catch (error) {
    console.error('Error calculating sea route:', error);
    return {
      status: 'error',
      distance: 0,
      duration: 0,
      waypoints: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
