"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Submission = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const submissionSchema = new mongoose_1.default.Schema({
    form: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Form", required: true },
    answers: mongoose_1.default.Schema.Types.Mixed, // key-value for field answers
    files: [{
            fieldId: String,
            url: String,
            filename: String
        }],
}, { timestamps: true });
exports.Submission = mongoose_1.default.models.Submission || mongoose_1.default.model("Submission", submissionSchema);
