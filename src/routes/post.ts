import { Router } from 'express'
import { loginController } from '../controllers/posts/login'
import { signUpController } from '../controllers/posts/signup'
import { usernameCheck } from '../controllers/gets/usernameCheck'
import path from 'path'
import multer from 'multer';

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

router.post('/api/v0/get/username', usernameCheck)
router.post('/api/v0/login', loginController)
router.post('/api/v0/signup', upload.single('avatar'), signUpController)

export default router
