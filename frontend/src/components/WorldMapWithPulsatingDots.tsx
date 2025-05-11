import { useState, useEffect } from 'react';
import * as d3 from 'd3';

// Define type interfaces
interface Location {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  color: string;
  description: string; // Add description property
}


export default function WorldMapWithPulsatingDots() {
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const mapWidth = 800;
  const mapHeight = 450;
  
  const locations: Location[] = [
    { name: "Central India", coordinates: [78.9629, 20.5937], color: "#00cc00", description: "A region in India known for its rich culture." },
    { name: "East EU", coordinates: [19.1451, 51.9194], color: "#00cc00", description: "Eastern Europe with diverse history and landscapes." },
    { name: "West US", coordinates: [-122.4194, 37.7749], color: "#00cc00", description: "Western United States, home to Silicon Valley." }
  ];
  
  // Create projection
  const projection = d3.geoNaturalEarth1()
    .scale(mapWidth / 6)
    .translate([mapWidth / 2, mapHeight / 2]);
    
  // Create path generator
  const pathGenerator = d3.geoPath().projection(projection);
  
  useEffect(() => {
    // Use simpler GeoJSON world data
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading map data:", err);
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-lg font-medium">Loading world map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <p className="text-lg font-medium text-red-500">Error loading map: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg mt-5">
      <div className="relative">
            <svg width="100%" height="100%" viewBox={`0 0 ${mapWidth} ${mapHeight}`} className="md:border-y border-gray-300 bg-white">
            {geoData && geoData.features.map((feature, i) => (
                <path
                key={i}
                d={pathGenerator(feature) || ''}
                // fill="#d1d5db"
                fill='#262626'
                stroke="#9ca3af"
                strokeWidth="0.5"
                />
            ))}
            {locations.map((location, index) => (
                <PulsatingDotSVG
                key={index}
                location={location}
                projection={projection}
                />
            ))}
            </svg>
      </div>
      
    </div>
  );
}

interface LocationWithPosition extends Location {
  x: number;
  y: number;
}

function PulsatingDotSVG({ location, projection }: { location: Location; projection: d3.GeoProjection }) {
  const [isPulsing, setIsPulsing] = useState(true);
  const [hoveredLocation, setHoveredLocation] = useState<LocationWithPosition | null>(null);
  
  const [x, y] = projection(location.coordinates) || [0, 0];

  const handleMouseEnter = (location: LocationWithPosition) => {
    setHoveredLocation(location);
  };

  const handleMouseLeave = () => {
    setHoveredLocation(null);
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <svg>
        <g 
          onMouseEnter={() => handleMouseEnter({ ...location, x, y })}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'pointer' }}
          className='group'
        >
          <circle
            cx={x}
            cy={y}
            r={isPulsing ? 6 : 9}
            fill={location.color}
            opacity={isPulsing ? 1 : 0.5}
            style={{
              transition: 'all 1s ease-in-out'
            }}
          />
          <circle
            cx={x}
            cy={y}
            r={4}
            fill={location.color}
          />
        </g>

        {hoveredLocation && (
            <g>
              <rect
                x={hoveredLocation.x + 15}
                y={hoveredLocation.y - 15}
                width={80}
                height={35}
                rx={5}
                ry={5}
                fill="white"
                stroke={hoveredLocation.color}
                strokeWidth={1}
                opacity={0.9}
              />
              <text
                x={hoveredLocation.x + 25}
                y={hoveredLocation.y}
                fontWeight="bold"
                fontSize={9}
                fill="#333"
              >
                {hoveredLocation.name}
              </text>
              {/* Tooltip description - wrapped */}
              {
                
                <text
                x={hoveredLocation.x + 25}
                y={hoveredLocation.y + 30}
                fontSize={8}
                fill="#666"
              >
              </text>}
            </g>
          )}
    </svg>

  );
}
