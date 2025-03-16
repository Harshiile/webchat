import { Navigate } from 'react-router-dom'
import Cookie from 'js-cookie'

const Auth = ({ children }) => Cookie.get('auth') ? children : <Navigate to='/login' />

export default Auth
