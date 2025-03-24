import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/public/rooms')
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname)
        const fileLength = file.originalname.length;
        const newFileName = file.originalname.slice(0, fileLength - ext.length);
        const uniqueSuffix = `${Date.now()}${ext}`
        cb(null, `${newFileName}_${uniqueSuffix}`)
    }
})
export const roomUpload = multer({ storage })