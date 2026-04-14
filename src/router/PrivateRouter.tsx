import { Navigate } from "react-router";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isLogged = localStorage.getItem("user")

  return isLogged ? children : <Navigate to="/login" />
}

export default PrivateRoute
