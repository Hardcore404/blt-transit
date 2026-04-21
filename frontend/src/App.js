import React, { useState } from "react";
import Map from "./Map";
import "./App.css";

export default function App() {
const [view, setView] = useState("landing"); // 'landing' | 'booking'
const [start, setStart] = useState("");
const [end, setEnd] = useState("");
const [name, setName] = useState("");
const [date, setDate] = useState("");
const [time, setTime] = useState("");

const stations = ["PMA", "SM Baguio", "La Trinidad"];

const fare = (() => {
if (!start || !end) return 0;
const i1 = stations.indexOf(start);
const i2 = stations.indexOf(end);
return Math.abs(i1 - i2) * 10 + 20;
})();

if (view === "landing") {
return ( <div className="landing"> <div className="hero"> <h1>🚆 BLT TRANSIT</h1> <p>
A smart train system connecting Baguio City and La Trinidad with
scheduled trips and simple seat booking. </p>

```
      <div className="features">
        <div>📍 Multiple stations</div>
        <div>⏱️ Scheduled departures</div>
        <div>🗺️ Real road routing</div>
      </div>

      <button className="primary" onClick={() => setView("booking")}>
        Book Now
      </button>
    </div>
  </div>
);
```

}

return ( <div className="main"> <header className="header"> <h2>🚆 BLT TRANSIT</h2>
<button className="ghost" onClick={() => setView("landing")}>
Back </button> </header>

```
  <div className="container">
    <div className="mapWrap">
      <Map start={start} end={end} />
    </div>

    <div className="card">
      <h3>Book Ticket</h3>

      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={start} onChange={(e) => setStart(e.target.value)}>
        <option value="">Select Start</option>
        {stations.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <select value={end} onChange={(e) => setEnd(e.target.value)}>
        <option value="">Select Destination</option>
        {stations.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select value={time} onChange={(e) => setTime(e.target.value)}>
        <option value="">Select Time</option>
        {["06:00","08:00","10:00","12:00","14:00","16:00","18:00"].map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>

      <div className="fare">Fare: ₱{fare}</div>

      <button
        className="primary"
        onClick={() => {
          if (!name || !start || !end || !date || !time) {
            alert("Please complete all fields.");
            return;
          }
          alert("Booking saved (demo).");
        }}
      >
        Book Ticket
      </button>
    </div>
  </div>
</div>
```

);
}
