import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

function Routing({ start, end }) {
useEffect(() => {
if (!start || !end || !window._map) return;

```
const control = L.Routing.control({
  waypoints: [
    L.latLng(start[0], start[1]),
    L.latLng(end[0], end[1])
  ],
  addWaypoints: false,
  draggableWaypoints: false,
  createMarker: () => null,
  show: false,
  lineOptions: {
    styles: [{ color: "#2563eb", weight: 5 }]
  }
}).addTo(window._map);

return () => {
  try { window._map.removeControl(control); } catch {}
};
```

}, [start, end]);

return null;
}

export default function Map({ start, end }) {
const stations = {
"PMA": [16.4213, 120.6207],
"SM Baguio": [16.4091, 120.5994],
"La Trinidad": [16.4561, 120.5875]
};

const s = stations[start];
const e = stations[end];

return (
<MapContainer
center={[16.43, 120.59]}
zoom={13}
style={{ height: "100%", width: "100%" }}
whenCreated={(m) => (window._map = m)}
> <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

```
  {s && <Marker position={s} />}
  {e && <Marker position={e} />}

  {s && e && <Routing start={s} end={e} />}
</MapContainer>
```

);
}
