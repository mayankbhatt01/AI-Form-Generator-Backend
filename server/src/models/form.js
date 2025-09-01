"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const fieldSchema = new mongoose_1.default.Schema({
    id: String,
    label: String,
    type: String,
    required: Boolean,
    placeholder: String,
    options: [String], // for select, radio, checkbox
    accept: [String], // for file
});
const formSchema = new mongoose_1.default.Schema({
    owner: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    title: String,
    prompt: String,
    formStructure: {
        title: String,
        fields: [fieldSchema],
        submitText: String
    },
    shareId: { type: String, unique: true },
}, { timestamps: true });
exports.Form = mongoose_1.default.models.Form || mongoose_1.default.model("Form", formSchema);
