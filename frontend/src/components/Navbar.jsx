import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="navbar">
      <Link className="brand" to="/dashboard">
        Health Monitor
      </Link>
      <div className="nav-links">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/submit-health">Submit Health</NavLink>
        <NavLink to="/records">Records</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
