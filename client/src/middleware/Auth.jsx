import { Navigate } from 'react-router-dom'
import Cookie from 'js-cookie'

const Auth = ({ children }) => Cookie.get('auth') ? <Navigate to='/profile' /> : children

export default Auth
