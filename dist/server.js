"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const thoughtRoutes_1 = __importDefault(require("./routes/thoughtRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware for parsing JSON
const PORT = process.env.PORT || 3000;
// MongoDB connection
const mongoUri = process.env.MONGOD_URI;
if (!mongoUri) {
    throw new Error('MONGOD_URI is not defined in the environment variables');
}
mongoose_1.default.connect(mongoUri)
    .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => console.error(error));
// API Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/thoughts', thoughtRoutes_1.default);
