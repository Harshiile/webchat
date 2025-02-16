import { Router } from 'express'
import { loginController } from '../controllers/login'
import { signUpController } from '../controllers/signup'
import { usernameCheck } from '../controllers/usernameCheck'
import path from 'path'
import multer from 'multer';
import { updateUserInDB } from '../controllers/update'
import { userDataFromAuth } from '../controllers/fetch/userdata'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/public/uploads')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const fileLength = file.originalname.length;
        const newFileName = file.originalname.slice(0, fileLength - ext.length);
        const uniqueSuffix = `${Date.now()}${ext}`
        cb(null, `${newFileName}_${uniqueSuffix}`)
    }
})
const upload = multer({ storage })
const router = Router()


router.post('/get/username', usernameCheck)
router.get('/get/user', userDataFromAuth)

router.post('/update/profile', upload.single('avatar'), updateUserInDB)
router.post('/login', loginController)
router.post('/signup', upload.single('avatar'), signUpController)

export default router
