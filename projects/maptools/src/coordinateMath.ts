import { fromLonLat, toLonLat } from 'ol/proj';
import { getDistance } from 'ol/sphere';

const projection: string = 'EPSG:3857';
const earthRadius = 6371000;


export const generateCirclePoints = (
  center: number[],
  radiusMeters: number,
): number[][] => {
  const points: number = 64;
  
  // 1. Convert center from Map Projection to Geodetic [lon, lat]
  const [lon, lat] = toLonLat(center, projection);
  
  const latRad = degToRad(lat);
  const lonRad = degToRad(lon);
  const angularDistance = radiusMeters / earthRadius;
  
  const result: number[][] = [];

  for (let i = 0; i < points; i++) {
    const bearing = (2 * Math.PI * i) / points;

    const lat2 = Math.asin(
      Math.sin(latRad) * Math.cos(angularDistance) +
      Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearing)
    );

    const lon2 = lonRad + Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(lat2)
    );

    // 2. Convert back to Map Projection [lon, lat]
    const point = fromLonLat([radToDeg(lon2), radToDeg(lat2)], projection);
    result.push(point);
  }

  // Close the polygon ring by adding the first point to the end
  result.push(result[0]);
  
  return result;
};

const degToRad = (deg: number) => (deg * Math.PI) / 180;
const radToDeg = (rad: number) => (rad * 180) / Math.PI;


export const computeDistance = (p1: number[], p2: number[]): number => {
  // Convert map coordinates to [lon, lat]
  const c1 = toLonLat(p1, projection);
  const c2 = toLonLat(p2, projection);

  
  
  // getDistance returns meters by default
  return getDistance(c1, c2);
};

export const generateThermometerPoints = (
  p1: number[],
  p2: number[],
  projection: string = 'EPSG:3857'
): number[][] => {
  const perpOffset = 150000.0;     // Length along the bisector
  const parallelOffset = 150000.0;  // Width of the rectangle
  const earthRadius = 6371000;

  // Helper conversions
  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;

  const [lon1Deg, lat1Deg] = toLonLat(p1, projection);
  const [lon2Deg, lat2Deg] = toLonLat(p2, projection);

  const lat1 = degToRad(lat1Deg);
  const lon1 = degToRad(lon1Deg);
  const lat2 = degToRad(lat2Deg);
  const lon2 = degToRad(lon2Deg);

  // 1. Find Midpoint (Spherical)
  const bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
  const by = Math.cos(lat2) * Math.sin(lon2 - lon1);
  const latMid = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by)
  );
  const lonMid = lon1 + Math.atan2(by, Math.cos(lat1) + bx);

  // 2. Calculate Bearings
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const lineBearing = Math.atan2(y, x); 
  const perpBearing = lineBearing + Math.PI / 2; // Perpendicular direction

  // 3. Destination Point Function (Haversine)
  const move = (lat: number, lon: number, brng: number, dist: number) => {
    const angular = dist / earthRadius;
    const latDest = Math.asin(
      Math.sin(lat) * Math.cos(angular) + 
      Math.cos(lat) * Math.sin(angular) * Math.cos(brng)
    );
    const lonDest = lon + Math.atan2(
      Math.sin(brng) * Math.sin(angular) * Math.cos(lat),
      Math.cos(angular) - Math.sin(lat) * Math.sin(latDest)
    );
    return { lat: latDest, lon: lonDest };
  };

  const toMap = (coords: {lat: number, lon: number}) => 
    fromLonLat([radToDeg(coords.lon), radToDeg(coords.lat)], projection);


  const count = 4;
  var pointsA = [];
  var pointsB = [];

  for(var i = 1; i < count; i++) {
    pointsA.push(move(latMid, lonMid, perpBearing, perpOffset/count*i));
    pointsB.push(move(latMid, lonMid, perpBearing + Math.PI, perpOffset/count*i));

  }

  // 4. Generate the 4 corners
  // We use the perpBearing and its opposite (perpBearing + PI) for the "height"
  const cornerA = move(latMid, lonMid, perpBearing + Math.PI, perpOffset);
  const cornerB = move(latMid, lonMid, perpBearing, perpOffset);
  
  // Shift the perpendicular line "sideways" along the lineBearing to create width
  const cornerC = move(cornerB.lat, cornerB.lon, lineBearing, parallelOffset);
  const cornerD = move(cornerA.lat, cornerA.lon, lineBearing, parallelOffset);

  const points = [
    cornerA,
    ...[...pointsB].reverse(), 
    { lat: latMid, lon: lonMid },
    ...pointsA,
    cornerB,
    cornerC,
    cornerD,
    cornerA // Close the loop
  ];

  // 2. Map the lat/lon objects to the projection coordinates
  return points.map(p => toMap(p));
};


export const generateThermometerPoints1 = (
  p1: number[],
  p2: number[],
  projection: string = 'EPSG:3857'
): number[][] => {
  const perpOffset = 150000;     // Length along the bisector
  const parallelOffset = 50000;  // Width of the rectangle
  const earthRadius = 6371000;

  // Helper conversions
  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const radToDeg = (rad: number) => (rad * 180) / Math.PI;

  const [lon1Deg, lat1Deg] = toLonLat(p1, projection);
  const [lon2Deg, lat2Deg] = toLonLat(p2, projection);

  const lat1 = degToRad(lat1Deg);
  const lon1 = degToRad(lon1Deg);
  const lat2 = degToRad(lat2Deg);
  const lon2 = degToRad(lon2Deg);

  // 1. Find Midpoint (Spherical)
  const bx = Math.cos(lat2) * Math.cos(lon2 - lon1);
  const by = Math.cos(lat2) * Math.sin(lon2 - lon1);
  const latMid = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bx) * (Math.cos(lat1) + bx) + by * by)
  );
  const lonMid = lon1 + Math.atan2(by, Math.cos(lat1) + bx);

  // 2. Calculate Bearings
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  
  const lineBearing = Math.atan2(y, x); 
  const perpBearing = lineBearing + Math.PI / 2; // Perpendicular direction

  // 3. Destination Point Function (Haversine)
  const move = (lat: number, lon: number, brng: number, dist: number) => {
    const angular = dist / earthRadius;
    const latDest = Math.asin(
      Math.sin(lat) * Math.cos(angular) + 
      Math.cos(lat) * Math.sin(angular) * Math.cos(brng)
    );
    const lonDest = lon + Math.atan2(
      Math.sin(brng) * Math.sin(angular) * Math.cos(lat),
      Math.cos(angular) - Math.sin(lat) * Math.sin(latDest)
    );
    return { lat: latDest, lon: lonDest };
  };

  const toMap = (coords: {lat: number, lon: number}) => 
    fromLonLat([radToDeg(coords.lon), radToDeg(coords.lat)], projection);

  // 4. Generate the 4 corners
  // We use the perpBearing and its opposite (perpBearing + PI) for the "height"
  const cornerA = move(latMid, lonMid, perpBearing + Math.PI, perpOffset);
  const cornerB = move(latMid, lonMid, perpBearing, perpOffset);
  
  // Shift the perpendicular line "sideways" along the lineBearing to create width
  const cornerC = move(cornerB.lat, cornerB.lon, lineBearing, parallelOffset);
  const cornerD = move(cornerA.lat, cornerA.lon, lineBearing, parallelOffset);

  return [
    toMap(cornerA),
    toMap(cornerB),
    toMap(cornerC),
    toMap(cornerD),
    toMap(cornerA) // Close the polygon loop
  ];
};