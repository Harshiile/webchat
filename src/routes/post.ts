import { Router } from 'express'
import { loginController } from '../controllers/login'
import { signUpController } from '../controllers/signup'
import { usernameCheck } from '../controllers/usernameCheck'
import { updateUserInDB } from '../controllers/update'
import { userDataFromAuth } from '../controllers/fetch/userdata'
import { logoutUser } from '../controllers/logout'
import { roomController, roomDeleteController } from '../controllers/room'
import { getUsername } from '../middlewares/getUsername'
import { userUpload } from '../multer/users'
import { roomUpload } from '../multer/rooms'
import { getRooms } from '../controllers/fetch/getRooms'


const router = Router()


router.post('/get/username', usernameCheck)
router.get('/get/user', userDataFromAuth)
router.get('/get/rooms', getRooms)

router.post('/update/profile', userUpload.single('avatar'), updateUserInDB)
router.post('/login', loginController)
router.post('/signup', userUpload.single('avatar'), signUpController)
router.post('/logout', logoutUser)
router.post('/room/create', roomUpload.single('avatar'), getUsername, roomController)
router.post('/room/delete', getUsername, roomDeleteController)

export default router
