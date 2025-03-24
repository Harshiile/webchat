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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashController = void 0;
const crypto_1 = require("crypto");
const base62_1 = __importDefault(require("base62"));
const lz_string_1 = __importDefault(require("lz-string"));
// AES Configuration
const algorithm = "aes-256-cbc";
const key = (0, crypto_1.randomBytes)(32); // 256-bit secret key
const iv = (0, crypto_1.randomBytes)(16); // 16-byte Initialization Vector (IV)
// 🔒 Encrypt Function
function encrypt(text) {
    // Step 1: Compress text
    const compressed = lz_string_1.default.compress(text);
    // Step 2: Encrypt with AES-256
    const cipher = (0, crypto_1.createCipheriv)(algorithm, key, iv);
    let encrypted = cipher.update(compressed, "utf-8", "base64");
    encrypted += cipher.final("base64");
    // Step 3: Encode to Base62 for short output
    return base62_1.default.encode(Buffer.from(encrypted, "base64"));
}
// 🔓 Decrypt Function
function decrypt(encryptedText) {
    // Step 1: Decode from Base62
    const decoded = Buffer.from(base62_1.default.decode(encryptedText)).toString("base64");
    // Step 2: Decrypt AES-256
    const decipher = (0, crypto_1.createDecipheriv)(algorithm, key, iv);
    let decrypted = decipher.update(decoded, "base64", "utf-8");
    decrypted += decipher.final("utf-8");
    // Step 3: Decompress text
    return lz_string_1.default.decompress(decrypted);
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
