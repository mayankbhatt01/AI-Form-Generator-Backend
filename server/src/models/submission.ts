import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  form: { type: mongoose.Schema.Types.ObjectId, ref: "Form", required: true },
  answers: mongoose.Schema.Types.Mixed, // key-value for field answers
  files: [{
    fieldId: String,
    url: String,
    filename: String
  }],
}, { timestamps: true });

export const Submission = mongoose.models.Submission ||  mongoose.model("Submission", submissionSchema);
