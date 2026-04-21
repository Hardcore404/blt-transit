import React, { useState, useEffect } from "react";
import axios from "axios";
import Map from "./Map";

function App() {
const [showBooking, setShowBooking] = useState(false);

const [name, setName] = useState("");
const [start, setStart] = useState("");
const [end, setEnd] = useState("");
const [date, setDate] = useState("");
const [time, setTime] = useState("");
const [seat, setSeat] = useState("");
const [data, setData] = useState([]);

const stations = [
"PMA","T.I","Camp John Hay","Nevada Square","Victory Liner",
"SM Baguio","Baguio Harrison","Teacher's Camp","Botanical Garden",
"Wright Park","Mirador Heritage Park","Diplomat Hotel","Stobosa",
"Strawberry Farm","La Trinidad","Wangal Sports Complex",
"Mt. Kalugong","Alapo Adventure Camp","Japanese Trail",
"Mt. Costa","Dragon Treasure","Skyland"
];

const schedule = [
"06:00","07:00","08:00","09:00",
"10:00","11:00","12:00","13:00",
"14:00","15:00","16:00","17:00",
"18:00","19:00","20:00"
];

const seats = Array.from({ length: 20 }, (_, i) => `Seat ${i + 1}`);

useEffect(() => {
if (showBooking) loadData();
}, [showBooking]);

const calculateFare = () => {
if (!start || !end) return 0;
const i1 = stations.indexOf(start);
const i2 = stations.indexOf(end);
return Math.abs(i1 - i2) * 10 + 20;
};

const isSeatTaken = () => {
return data.some(
(d) =>
d.route === `${start} → ${end}` &&
d.date === date &&
d.time === time &&
d.seat === seat
);
};

const bookTicket = async () => {
if (!name || !start || !end || !seat || !date || !time) {
alert("Complete all fields!");
return;
}

```
if (isSeatTaken()) {
  alert("Seat already taken!");
  return;
}

try {
  const ticket = {
    name,
    route: `${start} → ${end}`,
    date,
    time,
    seat,
    fare: calculateFare(),
    id: Date.now()
  };

  await axios.post("https://blt-transit.onrender.com/book", ticket);
  alert("Ticket booked!");
  loadData();

} catch (error) {
  alert("Booking failed.");
}
```

};

const loadData = async () => {
const res = await axios.get("https://blt-transit.onrender.com/dashboard");
setData(res.data);
};

const deleteBooking = async (i) => {
await axios.delete(`https://blt-transit.onrender.com/delete/${i}`);
loadData();
};

// 🎯 LANDING PAGE
if (!showBooking) {
return ( <div style={landingStyle}>
<h1 style={{ fontSize: "40px" }}>🚆 BLT TRANSIT</h1>

```
    <p style={{ maxWidth: "500px", margin: "20px auto" }}>
      BLT Transit is a smart train transportation system designed to connect 
      Baguio City to La Trinidad. It provides efficient, fast, and reliable 
      travel across major tourist destinations and stations.
    </p>

    <h3>🚄 Train System</h3>
    <p>Modern rail system with scheduled departures and seat management.</p>

    <h3>📍 Coverage</h3>
    <p>Baguio City → La Trinidad tourist routes and key locations.</p>

    <button 
      onClick={() => setShowBooking(true)} 
      style={buttonStyle}
    >
      Book Now
    </button>
  </div>
);
```

}

// 🎫 BOOKING PAGE
return ( <div style={mainStyle}>
<h1 style={{ textAlign: "center", color: "white" }}>🚆 BLT TRANSIT</h1>

```
  <Map selectedRoute={{ start, end }} setStart={setStart} setEnd={setEnd} />

  <div style={cardStyle}>
    <input placeholder="Name" onChange={e=>setName(e.target.value)} style={inputStyle}/>

    <select onChange={e=>setStart(e.target.value)} style={inputStyle}>
      <option>Select Start</option>
      {stations.map((s,i)=><option key={i}>{s}</option>)}
    </select>

    <select onChange={e=>setEnd(e.target.value)} style={inputStyle}>
      <option>Select Destination</option>
      {stations.map((s,i)=><option key={i}>{s}</option>)}
    </select>

    <input type="date" onChange={e=>setDate(e.target.value)} style={inputStyle}/>

    <select onChange={e=>setTime(e.target.value)} style={inputStyle}>
      <option>Select Time</option>
      {schedule.map((t,i)=><option key={i}>{t}</option>)}
    </select>

    <select onChange={e=>setSeat(e.target.value)} style={inputStyle}>
      <option>Select Seat</option>
      {seats.map((s,i)=><option key={i}>{s}</option>)}
    </select>

    <p>₱{calculateFare()}</p>

    <button onClick={bookTicket} style={buttonStyle}>
      Book Ticket
    </button>
  </div>

  <h2 style={{ textAlign: "center", color: "white" }}>Bookings</h2>

  {data.map((d,i)=>(
    <div key={i} style={ticketStyle}>
      <p>{d.name}</p>
      <p>{d.route}</p>
      <p>{d.date} | {d.time}</p>
      <p>{d.seat}</p>
      <p>₱{d.fare}</p>

      <button onClick={()=>deleteBooking(i)} style={deleteStyle}>
        Cancel
      </button>
    </div>
  ))}
</div>
```

);
}

// 🎨 STYLES
const landingStyle = {
minHeight: "100vh",
textAlign: "center",
background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
color: "white",
paddingTop: "100px"
};

const mainStyle = {
minHeight: "100vh",
background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
paddingBottom: "40px"
};

const cardStyle = {
background: "white",
padding: "20px",
width: "340px",
margin: "20px auto",
borderRadius: "15px"
};

const inputStyle = {
width: "100%",
padding: "10px",
margin: "8px 0"
};

const buttonStyle = {
padding: "12px 20px",
background: "#111",
color: "white",
border: "none",
borderRadius: "8px",
cursor: "pointer",
marginTop: "10px"
};

const ticketStyle = {
background: "white",
width: "320px",
margin: "15px auto",
padding: "15px",
borderRadius: "10px"
};

const deleteStyle = {
background: "red",
color: "white",
padding: "8px",
border: "none"
};

export default App;
