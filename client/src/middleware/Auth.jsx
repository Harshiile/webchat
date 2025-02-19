import { Navigate, Outlet } from 'react-router-dom'
import Cookie from 'js-cookie'

const Auth = () => Cookie.get('auth') ? <Outlet /> : <Navigate to='/login' />

export default Auth
