"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashController = void 0;
const crypto_1 = require("crypto");
// Define AES-256-CBC algorithm
const algorithm = "aes-256-cbc";
const key = (0, crypto_1.randomBytes)(32); // 256-bit key
const iv = (0, crypto_1.randomBytes)(16); // Initialization Vector (IV)
// Encrypt function
function encrypt(text) {
    const cipher = (0, crypto_1.createCipheriv)(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return { encrypted, iv: iv.toString("hex"), key: key.toString("hex") };
}
// Decrypt function
function decrypt(encryptedText, ivHex, keyHex) {
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, Buffer.from(keyHex, "hex"), Buffer.from(ivHex, "hex"));
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}
const hashController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    res.json({
        statusCode: 200,
        message: 'Done',
        data: [
            encrypt(message)
        ]
    });
});
exports.hashController = hashController;
