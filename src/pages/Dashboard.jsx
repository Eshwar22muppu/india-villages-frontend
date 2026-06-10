import { useState, useEffect } from "react"
import axios from "axios"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const API = "https://india-villages-api-five.vercel.app"

const chartData = [
  { day:"Mon", calls:120 },
  { day:"Tue", calls:340 },
  { day:"Wed", calls:280 },
  { day:"Thu", calls:450 },
  { day:"Fri", calls:390 },
  { day:"Sat", calls:180 },
  { day:"Sun", calls:220 },
]

const CARDS = [
  { label:"Total States",    value:"30",      bg:"#4f46e5", icon:"🗺️" },
  { label:"Total Villages",  value:"741,170", bg:"#059669", icon:"🏘️" },
  { label:"API calls today", value:"1,982",   bg:"#dc2626", icon:"📡" },
  { label:"Active users",    value:"1",       bg:"#d97706", icon:"👤" },
]

export default function Dashboard({ token }) {
  const [states,  setStates]  = useState([])
  const [search,  setSearch]  = useState("")
  const [results, setResults] = useState([])
  const [apiKey,  setApiKey]  = useState(null)
  const [tab,     setTab]     = useState("dashboard")

  useEffect(() => {
    axios.get(`${API}/api/states`).then(r => setStates(r.data.data))
  }, [])

  useEffect(() => {
    if (search.length < 2) { setResults([]); return }
    const timer = setTimeout(() => {
      axios.get(`${API}/api/villages/search?q=${search}`)
        .then(r => setResults(r.data.data))
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  async function generateKey() {
    try {
      const res = await axios.post(`${API}/api/auth/generate-key`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setApiKey(res.data)
    } catch {
      alert("Failed to generate key. Please login again.")
    }
  }

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", minHeight:"100vh",
      background:"#0f172a", color:"white" }}>

      {/* Header */}
      <div style={{ background:"#1e293b", borderBottom:"1px solid #334155",
        padding:"1rem 2rem", display:"flex", alignItems:"center",
        justifyContent:"space-between" }}>
        <div>
          <h1 style={{ fontSize:"20px", fontWeight:"700", margin:0,
            color:"white" }}>🇮🇳 India Villages API</h1>
          <p style={{ fontSize:"12px", color:"#94a3b8", margin:"4px 0 0" }}>
            Production Dashboard — Census 2011
          </p>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          {["dashboard","search","states","apikey"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:"6px 14px", borderRadius:"6px", border:"none",
                cursor:"pointer", fontSize:"13px", fontWeight:"500",
                background: tab===t ? "#4f46e5" : "#334155",
                color: tab===t ? "white" : "#94a3b8",
                transition:"all 0.2s" }}>
              {t === "dashboard" ? "📊 Dashboard"
               : t === "search"  ? "🔍 Search"
               : t === "states"  ? "🗺️ States"
               : "🔑 API Key"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding:"2rem", maxWidth:"1000px", margin:"0 auto" }}>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && <>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)",
            gap:"16px", marginBottom:"2rem" }}>
            {CARDS.map(c => (
              <div key={c.label} style={{ background:c.bg, borderRadius:"12px",
                padding:"1.25rem", boxShadow:"0 4px 12px rgba(0,0,0,0.3)" }}>
                <div style={{ fontSize:"28px", marginBottom:"8px" }}>{c.icon}</div>
                <div style={{ fontSize:"24px", fontWeight:"700" }}>{c.value}</div>
                <div style={{ fontSize:"12px", opacity:0.85, marginTop:"4px" }}>{c.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"#1e293b", border:"1px solid #334155",
            borderRadius:"12px", padding:"1.5rem", marginBottom:"2rem" }}>
            <h3 style={{ marginBottom:"1rem", color:"#e2e8f0", fontSize:"15px" }}>
              📈 API calls this week
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" stroke="#64748b" tick={{ fill:"#94a3b8" }} />
                <YAxis stroke="#64748b" tick={{ fill:"#94a3b8" }} />
                <Tooltip contentStyle={{ background:"#1e293b",
                  border:"1px solid #334155", color:"white" }} />
                <Line type="monotone" dataKey="calls" stroke="#4f46e5"
                  dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:"#1e293b", border:"1px solid #334155",
            borderRadius:"12px", padding:"1.5rem" }}>
            <h3 style={{ marginBottom:"1rem", color:"#e2e8f0", fontSize:"15px" }}>
              🌐 Live API Endpoints
            </h3>
            {[
              { method:"GET", path:"/api/states",              desc:"All states" },
              { method:"GET", path:"/api/states/:id/districts",desc:"Districts by state" },
              { method:"GET", path:"/api/villages/search?q=",  desc:"Search villages" },
              { method:"POST",path:"/api/auth/register",       desc:"Register user" },
              { method:"POST",path:"/api/auth/login",          desc:"Login" },
              { method:"POST",path:"/api/auth/generate-key",   desc:"Generate API key" },
            ].map(e => (
              <div key={e.path} style={{ display:"flex", alignItems:"center",
                gap:"12px", padding:"10px 0",
                borderBottom:"1px solid #334155", fontSize:"13px" }}>
                <span style={{ padding:"2px 8px", borderRadius:"4px", fontSize:"11px",
                  fontWeight:"700", background: e.method==="GET" ? "#059669" : "#4f46e5",
                  color:"white", minWidth:"36px", textAlign:"center" }}>
                  {e.method}
                </span>
                <code style={{ color:"#7dd3fc", flex:1 }}>{e.path}</code>
                <span style={{ color:"#94a3b8" }}>{e.desc}</span>
              </div>
            ))}
          </div>
        </>}

        {/* SEARCH TAB */}
        {tab === "search" && (
          <div style={{ background:"#1e293b", border:"1px solid #334155",
            borderRadius:"12px", padding:"1.5rem" }}>
            <h3 style={{ marginBottom:"1rem", color:"#e2e8f0" }}>🔍 Search Villages</h3>
            <input
              placeholder="Type village name (min 2 characters)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width:"100%", padding:"12px", border:"1px solid #334155",
                borderRadius:"8px", marginBottom:"1rem", fontSize:"14px",
                background:"#0f172a", color:"white", boxSizing:"border-box" }}
            />
            <div style={{ color:"#64748b", fontSize:"13px", marginBottom:"12px" }}>
              {results.length > 0 ? `Found ${results.length} results` : "Type to search..."}
            </div>
            {results.map(v => (
              <div key={v.id} style={{ padding:"12px",
                borderBottom:"1px solid #334155", fontSize:"13px" }}>
                <strong style={{ color:"#e2e8f0" }}>{v.name}</strong>
                <span style={{ color:"#64748b", marginLeft:"8px", fontSize:"12px" }}>
                  {v.subDistrict?.name} → {v.subDistrict?.district?.name} → {v.subDistrict?.district?.state?.name}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* STATES TAB */}
        {tab === "states" && (
          <div style={{ background:"#1e293b", border:"1px solid #334155",
            borderRadius:"12px", padding:"1.5rem" }}>
            <h3 style={{ marginBottom:"1rem", color:"#e2e8f0" }}>
              🗺️ All States & UTs ({states.length})
            </h3>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
              {states.map((s, i) => (
                <div key={s.id} style={{ padding:"10px 14px", background:"#0f172a",
                  borderRadius:"8px", border:"1px solid #334155",
                  fontSize:"13px", display:"flex", alignItems:"center", gap:"8px" }}>
                  <span style={{ background:"#4f46e5", color:"white",
                    borderRadius:"4px", padding:"2px 6px", fontSize:"11px",
                    fontWeight:"600" }}>{i+1}</span>
                  <span style={{ color:"#e2e8f0" }}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API KEY TAB */}
        {tab === "apikey" && (
          <div style={{ background:"#1e293b", border:"1px solid #334155",
            borderRadius:"12px", padding:"1.5rem" }}>
            <h3 style={{ marginBottom:"0.5rem", color:"#e2e8f0" }}>🔑 Generate API Key</h3>
            <p style={{ color:"#94a3b8", fontSize:"13px", marginBottom:"1.5rem" }}>
              Generate a key and secret to authenticate your API requests.
            </p>
            <button onClick={generateKey}
              style={{ padding:"12px 24px", background:"#4f46e5", color:"white",
                border:"none", borderRadius:"8px", cursor:"pointer",
                fontSize:"14px", fontWeight:"600" }}>
              Generate New Key
            </button>
            {apiKey && (
              <div style={{ marginTop:"1.5rem", background:"#0f172a",
                padding:"1.25rem", borderRadius:"8px",
                border:"1px solid #334155", fontSize:"13px" }}>
                <div style={{ marginBottom:"10px" }}>
                  <span style={{ color:"#94a3b8" }}>API Key: </span>
                  <code style={{ color:"#7dd3fc" }}>{apiKey.key}</code>
                </div>
                <div style={{ marginBottom:"12px" }}>
                  <span style={{ color:"#94a3b8" }}>Secret: </span>
                  <code style={{ color:"#34d399" }}>{apiKey.secret}</code>
                </div>
                <div style={{ background:"#dc2626", padding:"8px 12px",
                  borderRadius:"6px", fontSize:"12px", color:"white" }}>
                  ⚠️ Save your secret now — it will NOT be shown again!
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}