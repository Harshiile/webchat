import { Navigate, Outlet } from 'react-router-dom'
import Cookie from 'js-cookie'

const NoAuth = () => Cookie.get('auth') ? <Navigate to='/profile' /> : <Outlet />

export default NoAuth
