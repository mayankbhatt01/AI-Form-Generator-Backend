import { Router } from "express";
import { Form } from "../models/form";
import { Submission } from "../models/submission";
import { nanoid } from "nanoid";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { generateFormSchema } from "../service/gemini";
import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temp store

router.post("/:shareId/submit", upload.any(), async (req: any, res) => {
  try {
    const form = await Form.findOne({ shareId: req.params.shareId });
    if (!form) return res.status(404).json({ message: "Form not found" });

    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
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

    const submission = await Submission.create({
      form: form._id,
      answers: req.body,
      files: uploadedFiles,
    });

    res.json({ message: "Submitted", submission });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create new form
router.post("/create", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { title, schema } = req.body;
    const form = await Form.create({
      owner: req.user.id,
      title,
      schema,   // ✅ model field name ko match karna zaruri hai
      shareId: nanoid(8),
    });

    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// ✅ Get all forms of logged-in user (dashboard)
router.get("/my", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const forms = await Form.find({ owner: req.user.id }).sort({ createdAt: -1 }).lean();
    const allForms = forms.map((e) => e._id + "");
    const submissions = await Submission.find({ form: { $in: allForms } }).lean()
    const submissionFormMap:any = {};
    submissions.forEach((e) => {
      if(submissionFormMap[e.form]){
        submissionFormMap[e.form] += 1
      }else{
        submissionFormMap[e.form] = 1
      }
    });
    const formattedData = forms.map((e) => ({...e, submissions : submissionFormMap[(e as any)._id] || 0}))
    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get form by shareId (public)
router.get("/:shareId", async (req, res) => {
  try {
    const form = await Form.findOne({ shareId: req.params.shareId });
    if (!form) return res.status(404).json({ message: "Form not found" });

    res.json(form);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Get submissions (owner only)
router.get("/:formId/submissions", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) return res.status(404).json({ message: "Form not found" });

    if (form.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    const submissions = await Submission.find({ form: form._id });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});
router.post("/generate", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { prompt } = req.body;

    const schema = await generateFormSchema(prompt);

    const form = await Form.create({
      owner: req.user.id,
      title: schema.title,
      shareId: nanoid(8),
      ...schema,
    });

    res.json(form);
  } catch (err) {
    console.log('Error ', err)
    res.status(500).json({ error: err });
  }
});

export default router;
