import { useState, useEffect } from 'react';
import * as d3 from 'd3';
import { codeToStatus } from '../utils/codesConversion';

interface Location {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  color: string;
  status: number;
  responseTime: number
}


export default function WorldMapWithPulsatingDots(
  {
    centralIndia = 200,
    westEU = 200,
    eastUS = 200,
    showStatus = false,
    responseTimeCI = 0,
    responseTimeWE = 0,
    responseTimeEUS = 0
  }:
  {
    centralIndia?: number,
    westEU?: number,
    eastUS?: number,
    showStatus?: boolean,
    responseTimeCI?: number,
    responseTimeWE?: number,
    responseTimeEUS?: number
  }
) {
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection<GeoJSON.Geometry> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const mapWidth = 800;
  const mapHeight = 450;
  
  const locations: Location[] = [
    { name: "Central India", coordinates: [78.9629, 20.5937], color: codeToStatus(centralIndia) ? "#00cc00" : "#cc0000", status: centralIndia, responseTime: responseTimeCI },
    { name: "West EU", coordinates: [3.1451, 47.9194], color: codeToStatus(westEU) ? "#00cc00" : "#cc0000", status: westEU, responseTime: responseTimeWE },
    { name: "East US", coordinates: [-80.0190, 37.7749], color: codeToStatus(eastUS) ? "#00cc00" : "#cc0000", status: eastUS, responseTime: responseTimeEUS}
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
    <div className="rounded-lg mt-5">
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
                  showStatus={showStatus}
                  status={location.status}
                  responseTime={location.responseTime}
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

function PulsatingDotSVG(
  { 
    location, 
    projection, 
    showStatus = false, 
    status = 0,
    responseTime = 0
  }
  : { 
    location: Location; 
    projection: d3.GeoProjection, 
    showStatus: boolean, 
    status?: number,
    responseTime?: number
  }) {

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
                height={showStatus ? 45 : 25}
                rx={5}
                ry={5}
                fill="white"
                stroke={hoveredLocation.color}
                strokeWidth={1}
                opacity={0.9}
              />
              <text
                x={hoveredLocation.x + 19}
                y={hoveredLocation.y}
                fontWeight="bold"
                fontSize={9}
                fill="#333"
              >
                {showStatus ?  `status code: ${status}` : hoveredLocation.name}
              </text>

              {
                showStatus ? 
                <text
                  x={hoveredLocation.x + 19}
                  y={hoveredLocation.y + 11}
                  fontWeight="bold"
                  fontSize={9}
                  fill="#333"
                >
                  {`Response Time`}
                </text>
                : null
              }

              {
                showStatus ? 
                <text
                  x={hoveredLocation.x + 40}
                  y={hoveredLocation.y + 24}
                  // fontWeight="bold"
                  fontSize={10}
                  fill="#333"
                >
                  {`${responseTime}ms`}
                </text>
                : null
              }


              {/* Tooltip description - wrapped */}
            </g>
          )}
    </svg>

  );
}
