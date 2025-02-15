"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const login_1 = require("../controllers/posts/login");
const signup_1 = require("../controllers/posts/signup");
const usernameCheck_1 = require("../controllers/gets/usernameCheck");
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'client/public/uploads');
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const fileLength = file.originalname.length;
        const newFileName = file.originalname.slice(0, fileLength - ext.length);
        const uniqueSuffix = `${Date.now()}${ext}`;
        cb(null, `${newFileName}_${uniqueSuffix}`);
    }
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
router.post('/api/v0/get/username', usernameCheck_1.usernameCheck);
router.post('/api/v0/login', login_1.loginController);
router.post('/api/v0/signup', upload.single('avatar'), signup_1.signUpController);
exports.default = router;
