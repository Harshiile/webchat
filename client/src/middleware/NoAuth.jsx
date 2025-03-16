import { Navigate } from 'react-router-dom'
import Cookie from 'js-cookie'

const NoAuth = ({ children }) => Cookie.get('auth') ? <Navigate to='/profile' /> : children

export default NoAuth

