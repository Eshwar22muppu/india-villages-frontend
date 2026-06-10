import { useState } from "react"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"

export default function App() {
  const [token, setToken] = useState(null)

  if (!token) {
    return <Login onLogin={setToken} />
  }
  return <Dashboard token={token} />
}