import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Register } from "./pages/Register"
import { Dashboard } from "./pages/Dashboard"
import { getClientId } from "./lib/clientId"
import { SubmitProject } from "./pages/SubmitProject"
import { ViewRepositories } from "./pages/ViewRepositories"

// Initialize client ID on app start
getClientId()

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ViewRepositories />} />
          <Route path="/submit" element={<SubmitProject />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
