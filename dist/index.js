"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const forms_1 = __importDefault(require("./routes/forms"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send("Server is Running");
});
app.use("/api/forms", forms_1.default);
// Routes
app.use("/api/auth", auth_1.default);
mongoose_1.default.connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(4000, () => console.log("Server running on http://localhost:4000"));
})
    .catch(err => console.error(err));
