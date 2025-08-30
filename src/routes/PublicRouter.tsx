import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../hooks"

export const PublicRoute = () =>{
  const {token} = useAuth()
  return token ? <Navigate to='/perfil' /> : <Outlet />
}