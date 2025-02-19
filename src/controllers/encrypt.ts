import { Request, Response } from 'express'
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { APIResponse } from '../types/APIResponse'



// Define AES-256-CBC algorithm
const algorithm = "aes-256-cbc";
const key = randomBytes(32); // 256-bit key
const iv = randomBytes(16);  // Initialization Vector (IV)

// Encrypt function
function encrypt(text: string) {
    const cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return { encrypted, iv: iv.toString("hex"), key: key.toString("hex") };
}

// Decrypt function
function decrypt(encryptedText: string, ivHex: string, keyHex: string) {
    const decipher = createDecipheriv(algorithm, Buffer.from(keyHex, "hex"), Buffer.from(ivHex, "hex"));
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
}





export const hashController = async (req: Request<{}, {}, { message: string }>, res: Response<APIResponse>) => {
    const { message } = req.body
    res.json({
        statusCode: 200,
        message: 'Done',
        data: [
            encrypt(message)
        ]
    })
}