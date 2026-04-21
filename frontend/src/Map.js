import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";

function Routing({ start, end }) {
useEffect(() => {
if (!start || !end) return;

```
const routing = L.Routing.control({
  waypoints: [
    L.latLng(start[0], start[1]),
    L.latLng(end[0], end[1])
  ],
  routeWhileDragging: false,
  addWaypoints: false,
  draggableWaypoints: false,
  createMarker: () => null, // remove default markers
}).addTo(window.map);

return () => {
  window.map.removeControl(routing);
};
```

}, [start, end]);

return null;
}

function Map({ selectedRoute }) {

const allStations = [
{ name: "PMA", coords: [16.421300, 120.620700] },
{ name: "T.I", coords: [16.416000, 120.611000] },
{ name: "Camp John Hay", coords: [16.397265, 120.611316] },
{ name: "Nevada Square", coords: [16.403326, 120.605340] },
{ name: "Victory Liner", coords: [16.405713, 120.602605] },
{ name: "SM Baguio", coords: [16.409078, 120.599780] },
{ name: "Baguio Harrison", coords: [16.409828, 120.597144] },
{ name: "Teacher's Camp", coords: [16.412115, 120.606364] },
{ name: "Botanical Garden", coords: [16.415168, 120.612919] },
{ name: "Wright Park", coords: [16.424900, 120.616000] },
{ name: "Mirador Heritage Park", coords: [16.410222, 120.579728] },
{ name: "Diplomat Hotel", coords: [16.404089, 120.586653] },
{ name: "Stobosa", coords: [16.455600, 120.586300] },
{ name: "Strawberry Farm", coords: [16.460800, 120.580600] },
{ name: "La Trinidad", coords: [16.448063, 120.591286] },
{ name: "Wangal Sports Complex", coords: [16.456163, 120.572805] },
{ name: "Mt. Kalugong", coords: [16.460582, 120.596181] },
{ name: "Alapo Adventure Camp", coords: [16.451014, 120.570062] },
{ name: "Japanese Trail", coords: [16.449894, 120.570767] },
{ name: "Mt. Costa", coords: [16.443231, 120.552248] },
{ name: "Dragon Treasure", coords: [16.422068, 120.566452] },
{ name: "Skyland", coords: [16.411139, 120.562472] }
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
```

);
}

export default Map;
