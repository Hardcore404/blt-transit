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
    { name: "PMA", coords: [16.420, 120.620] },
    { name: "T.I", coords: [16.415, 120.610] },
    { name: "Camp John Hay", coords: [16.398, 120.620] },
    { name: "Nevada Square", coords: [16.402, 120.600] },
    { name: "Victory Liner", coords: [16.410, 120.595] },
    { name: "SM Baguio", coords: [16.408, 120.598] },
    { name: "(MAIN TERMINAL) Baguio Harrison", coords: [16.412, 120.596] },
    { name: "Teacher's Camp", coords: [16.416, 120.602] },
    { name: "Botanical Garden", coords: [16.420, 120.610] },
    { name: "Wright Park", coords: [16.425, 120.615] },
    { name: "Mirador Heritage Park", coords: [16.400, 120.580] },
    { name: "Diplomat Hotel", coords: [16.395, 120.585] },
    { name: "Stobosa", coords: [16.455, 120.585] },
    { name: "Strawberry Farm", coords: [16.460, 120.580] },
    { name: "La Trinidad", coords: [16.455, 120.587] },
    { name: "Wangal Sports Complex", coords: [16.480, 120.592] },
    { name: "Mt. Kalugong", coords: [16.470, 120.600] },
    { name: "Alapo Adventure Camp", coords: [16.465, 120.605] },
    { name: "Japanese Trail", coords: [16.460, 120.610] },
    { name: "Mt. Costa", coords: [16.470, 120.620] },
    { name: "Dragon Treasure", coords: [16.475, 120.625] },
    { name: "Skyland", coords: [16.480, 120.630] }
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