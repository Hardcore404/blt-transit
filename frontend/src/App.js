import React, { useState, useEffect } from "react";
import axios from "axios";
import Map from "./Map";

const inputStyle = { width:"100%", padding:"10px", margin:"8px 0" };
const buttonStyle = { width:"100%", padding:"10px", background:"#1e3a8a", color:"white", border:"none" };
const deleteStyle = { background:"red", color:"white", padding:"8px", border:"none" };
const ticketStyle = { background:"white", margin:"10px auto", width:"320px", padding:"10px", borderRadius:"10px" };

function App() {
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
loadData();
}, []);

// 💰 Fare calculation
const calculateFare = () => {
if (!start || !end) return 0;
const i1 = stations.indexOf(start);
const i2 = stations.indexOf(end);
return Math.abs(i1 - i2) * 10 + 20;
};

// 💺 Seat lock
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
const selected = new Date(`${date}T${time}`);
if (selected < new Date()) {
  alert("Select future schedule!");
  return;
}

if (isSeatTaken()) {
  alert("❌ Seat already taken!");
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

  alert("✅ Ticket booked!");

  loadData();

} catch (error) {
  console.error(error);
  alert("❌ Booking failed.");
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

return (
<div style={{ fontFamily: "Arial", background: "#eef2f7", minHeight: "100vh" }}>

```
  <div style={{ background: "#1e3a8a", color: "white", padding: "15px", textAlign: "center" }}>
    🚆 BLT TRANSIT
  </div>

  <div style={{ padding: "20px", textAlign: "center" }}>

    <Map selectedRoute={{ start, end }} setStart={setStart} setEnd={setEnd} />

    <div style={{ background: "white", padding: "20px", width: "320px", margin: "20px auto", borderRadius: "12px" }}>

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

      <p>💰 Fare: ₱{calculateFare()}</p>

      <button onClick={bookTicket} style={buttonStyle}>
        Book Ticket
      </button>
    </div>

    <h2>Bookings</h2>
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
</div>
```

);
}

export default App;
