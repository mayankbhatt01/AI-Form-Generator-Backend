"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const form_1 = require("../models/form");
const submission_1 = require("../models/submission");
const nanoid_1 = require("nanoid");
const auth_1 = require("../middleware/auth");
const gemini_1 = require("../server/src/service/gemini");
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: "uploads/" }); // temp store
router.post("/:shareId/submit", upload.any(), async (req, res) => {
    try {
        const form = await form_1.Form.findOne({ shareId: req.params.shareId });
        if (!form)
            return res.status(404).json({ message: "Form not found" });
        let uploadedFiles = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await cloudinary_1.default.uploader.upload(file.path, {
                    folder: "form_submissions",
                });
                uploadedFiles.push({
                    url: result.secure_url,
                    public_id: result.public_id,
                    format: result.format,
                    resource_type: result.resource_type,
                });
            }
        }
        const submission = await submission_1.Submission.create({
            form: form._id,
            answers: req.body,
            files: uploadedFiles,
        });
        res.json({ message: "Submitted", submission });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
// Create new form
router.post("/create", auth_1.authMiddleware, async (req, res) => {
    try {
        const { title, schema } = req.body;
        const form = await form_1.Form.create({
            owner: req.user.id,
            title,
            schema, // ✅ model field name ko match karna zaruri hai
            shareId: (0, nanoid_1.nanoid)(8),
        });
        res.json(form);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
// ✅ Get all forms of logged-in user (dashboard)
router.get("/my", auth_1.authMiddleware, async (req, res) => {
    try {
        const forms = await form_1.Form.find({ owner: req.user.id }).sort({ createdAt: -1 }).lean();
        const allForms = forms.map((e) => e._id + "");
        const submissions = await submission_1.Submission.find({ form: { $in: allForms } }).lean();
        const submissionFormMap = {};
        submissions.forEach((e) => {
            if (submissionFormMap[e.form]) {
                submissionFormMap[e.form] += 1;
            }
            else {
                submissionFormMap[e.form] = 1;
            }
        });
        const formattedData = forms.map((e) => ({ ...e, submissions: submissionFormMap[e._id] || 0 }));
        res.json(formattedData);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
// Get form by shareId (public)
router.get("/:shareId", async (req, res) => {
    try {
        const form = await form_1.Form.findOne({ shareId: req.params.shareId });
        if (!form)
            return res.status(404).json({ message: "Form not found" });
        res.json(form);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
// Get submissions (owner only)
router.get("/:formId/submissions", auth_1.authMiddleware, async (req, res) => {
    try {
        const form = await form_1.Form.findById(req.params.formId);
        if (!form)
            return res.status(404).json({ message: "Form not found" });
        if (form.owner.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });
        const submissions = await submission_1.Submission.find({ form: form._id });
        res.json(submissions);
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
});
router.post("/generate", auth_1.authMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;
        const schema = await (0, gemini_1.generateFormSchema)(prompt);
        const form = await form_1.Form.create({
            owner: req.user.id,
            title: schema.title,
            shareId: (0, nanoid_1.nanoid)(8),
            ...schema,
        });
        res.json(form);
    }
    catch (err) {
        console.log('Error ', err);
        res.status(500).json({ error: err });
    }
});
exports.default = router;
