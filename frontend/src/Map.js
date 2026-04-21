import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

function Routing({ start, end }) {
useEffect(() => {
if (!start || !end) return;

const routing = L.Routing.control({
  waypoints: [
    L.latLng(start[0], start[1]),
    L.latLng(end[0], end[1])
  ],
  routeWhileDragging: false,
  addWaypoints: false,
  draggableWaypoints: false,

  // 🎯 HIDE PANEL
  show: false,

  // 🎨 STYLE ROUTE
  lineOptions: {
    styles: [
      { color: "#1e3a8a", weight: 6 },
      { color: "#3b82f6", weight: 3 }
    ]
  },

  // 🚫 REMOVE DEFAULT MARKERS
  createMarker: () => null,

  // 🧠 BETTER ROUTING
  router: L.Routing.osrmv1({
    serviceUrl: "https://router.project-osrm.org/route/v1"
  })

}).addTo(window.map);

return () => {
  if (window.map && routing) {
    window.map.removeControl(routing);
  }
};

}, [start, end]);

return null;
}

function Map({ selectedRoute }) {

const allStations = [
 { name: "PMA", coords: [16.421300, 120.620700] }, // main gate
  { name: "T.I", coords: [16.416050, 120.611200] },
  { name: "Camp John Hay", coords: [16.399200, 120.620600] }, // entrance road
  { name: "Nevada Square", coords: [16.402600, 120.601100] },
  { name: "Victory Liner", coords: [16.410700, 120.595900] }, // terminal entrance
  { name: "SM Baguio", coords: [16.409100, 120.599400] }, // main entrance
  { name: "Baguio Harrison", coords: [16.412600, 120.596400] },
  { name: "Teacher's Camp", coords: [16.416700, 120.603200] }, // gate
  { name: "Botanical Garden", coords: [16.421200, 120.610800] }, // entrance
  { name: "Wright Park", coords: [16.425100, 120.616000] }, // horse area entrance
  { name: "Mirador Heritage Park", coords: [16.400500, 120.580600] }, // entrance road
  { name: "Diplomat Hotel", coords: [16.395200, 120.585900] },
  { name: "Stobosa", coords: [16.455800, 120.586400] }, // main viewing road
  { name: "Strawberry Farm", coords: [16.461100, 120.580700] }, // entrance
  { name: "La Trinidad", coords: [16.456100, 120.587500] }, // town center road
  { name: "Wangal Sports Complex", coords: [16.480600, 120.593300] },
  { name: "Mt. Kalugong", coords: [16.471200, 120.600900] }, // entrance
  { name: "Alapo Adventure Camp", coords: [16.466300, 120.606200] },
  { name: "Japanese Trail", coords: [16.460500, 120.611000] },
  { name: "Mt. Costa", coords: [16.470900, 120.621200] }, // gate
  { name: "Dragon Treasure", coords: [16.476000, 120.626000] },
  { name: "Skyland", coords: [16.481400, 120.630600] }
];

const startStation = allStations.find(s => s.name === selectedRoute.start);
const endStation = allStations.find(s => s.name === selectedRoute.end);

return (
<MapContainer
center={[16.43, 120.59]}
zoom={13}
style={{ height: "350px" }}
whenCreated={(map) => (window.map = map)}
> <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

```
  {startStation && <Marker position={startStation.coords} />}
  {endStation && <Marker position={endStation.coords} />}

  {startStation && endStation && (
    <Routing start={startStation.coords} end={endStation.coords} />
  )}
</MapContainer>


);
}

export default Map;
