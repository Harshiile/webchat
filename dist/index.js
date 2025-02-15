"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("./routes/post"));
const connect_1 = require("./lib/connect");
require('dotenv').config();
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(post_1.default);
const PORT = process.env.PORT || 5000;
(0, connect_1.connectDB)()
    .then(res => {
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});
