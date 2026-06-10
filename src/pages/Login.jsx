import { useState } from "react"
import axios from "axios"

const API = "https://india-villages-api-five.vercel.app"

export default function Login({ onLogin }) {
  const [email,    setEmail]    = useState("")
  const [password, setPassword] = useState("")
  const [error,    setError]    = useState("")

  async function handleLogin() {
    try {
      const res = await axios.post(`${API}/api/auth/login`, { email, password })
      onLogin(res.data.token)
    } catch {
      setError("Invalid email or password")
    }
  }

  return (
    <div style={{ display:"flex", justifyContent:"center",
      alignItems:"center", height:"100vh", background:"#f5f5f5" }}>
      <div style={{ background:"white", padding:"2rem",
        borderRadius:"12px", width:"320px", boxShadow:"0 2px 12px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom:"1.5rem", textAlign:"center" }}>
          India Villages API
        </h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width:"100%", padding:"10px", marginBottom:"10px",
            border:"1px solid #ddd", borderRadius:"6px", fontSize:"14px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ width:"100%", padding:"10px", marginBottom:"10px",
            border:"1px solid #ddd", borderRadius:"6px", fontSize:"14px" }}
        />
        {error && <p style={{ color:"red", fontSize:"13px" }}>{error}</p>}
        <button
          onClick={handleLogin}
          style={{ width:"100%", padding:"10px", background:"#000",
            color:"white", border:"none", borderRadius:"6px",
            fontSize:"14px", cursor:"pointer" }}>
          Login
        </button>
      </div>
    </div>
  )
}