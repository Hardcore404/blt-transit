import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 📍 Default Pin Icon
const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// 🚆 REAL TRAIN ICON (FIXED)
const trainIcon = new L.Icon({
  iconUrl: "train.png",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function Map({ selectedRoute, setStart, setEnd }) {

  const allStations = [
   { name: "PMA", coords: [16.421049, 120.620553] },
  { name: "T.I", coords: [16.415905, 120.610941] },
  { name: "Camp John Hay", coords: [16.398395, 120.620233] },
  { name: "Nevada Square", coords: [16.402240, 120.600834] },
  { name: "Victory Liner", coords: [16.410417, 120.595528] },
  { name: "SM Baguio", coords: [16.408870, 120.599200] },
  { name: "Baguio Harrison", coords: [16.412350, 120.596220] },
  { name: "Teacher's Camp", coords: [16.416480, 120.602850] },
  { name: "Botanical Garden", coords: [16.420870, 120.610420] },
  { name: "Wright Park", coords: [16.424780, 120.615660] },
  { name: "Mirador Heritage Park", coords: [16.400160, 120.580240] },
  { name: "Diplomat Hotel", coords: [16.394880, 120.585470] },
  { name: "Stobosa", coords: [16.455350, 120.585990] },
  { name: "Strawberry Farm", coords: [16.460650, 120.580340] },
  { name: "La Trinidad", coords: [16.455820, 120.587200] },
  { name: "Wangal Sports Complex", coords: [16.480140, 120.592890] },
  { name: "Mt. Kalugong", coords: [16.470830, 120.600540] },
  { name: "Alapo Adventure Camp", coords: [16.465970, 120.605930] },
  { name: "Japanese Trail", coords: [16.460210, 120.610770] },
  { name: "Mt. Costa", coords: [16.470410, 120.620830] },
  { name: "Dragon Treasure", coords: [16.475610, 120.625540] },
  { name: "Skyland", coords: [16.480980, 120.630210] }
  ];

  const handleClick = (name) => {
    if (!selectedRoute.start) {
      setStart(name);
    } else if (!selectedRoute.end) {
      setEnd(name);
    } else {
      setStart(name);
      setEnd("");
    }
  };

  const getRoute = () => {
    if (!selectedRoute.start || !selectedRoute.end) return [];

    const startIndex = allStations.findIndex(s => s.name === selectedRoute.start);
    const endIndex = allStations.findIndex(s => s.name === selectedRoute.end);

    if (startIndex < endIndex) {
      return allStations.slice(startIndex, endIndex + 1);
    } else {
      return allStations.slice(endIndex, startIndex + 1).reverse();
    }
  };

  const routeStations = getRoute();
  const routeCoords = routeStations.map(s => s.coords);

  const [position, setPosition] = useState(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (routeCoords.length === 0) return;

    let i = 0;
    setPosition(routeCoords[0]);

    const interval = setInterval(() => {
      i++;
      if (i < routeCoords.length) {
        setPosition(routeCoords[i]);
      } else {
        i = 0;
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedRoute]);

  function getDistance(a, b) {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;

    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;

    const x =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
  }

  let totalDistance = 0;
  for (let i = 0; i < routeCoords.length - 1; i++) {
    totalDistance += getDistance(routeCoords[i], routeCoords[i + 1]);
  }

  const speed = 40;
  const time = totalDistance / speed;

  return (
    <div>

      {routeCoords.length > 0 && (
        <>
          <p>📏 Distance: {totalDistance.toFixed(2)} km</p>
          <p>⏱️ Time: {(time * 60).toFixed(0)} mins</p>
        </>
      )}

      <MapContainer center={[16.43, 120.59]} zoom={13} style={{ height: "300px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {allStations.map((s, i) => (
          <Marker
            key={i}
            position={s.coords}
            icon={pinIcon}
            eventHandlers={{
              click: () => handleClick(s.name)
            }}
          >
            <Popup>
              <b>{s.name}</b>
              {selectedRoute.start === s.name && " (Start)"}
              {selectedRoute.end === s.name && " (End)"}
            </Popup>
          </Marker>
        ))}

        {routeCoords.length > 0 && (
          <Polyline positions={routeCoords} color="red" />
        )}

        {position && (
          <Marker position={position} icon={trainIcon} />
        )}
      </MapContainer>
    </div>
  );
}

export default Map;