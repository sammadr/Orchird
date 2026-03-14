import { Navigate, useLocation } from 'react-router-dom'

function RequireAuth({ children }) {
  const location = useLocation()
  const isLogged = localStorage.getItem('orchirdSession') === 'active'

  if (!isLogged) {
    return <Navigate to="/login" replace state={{ redirectTo: location.pathname }} />
  }

  return children
}

export default RequireAuth
