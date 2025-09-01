import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  id: String,
  label: String,
  type: String,
  required: Boolean,
  placeholder: String,
  options: [String], // for select, radio, checkbox
  accept: [String],  // for file
});

const formSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  prompt: String,
  formStructure: {   // 👈 renamed (was `schema`)
    title: String,
    fields: [fieldSchema],
    submitText: String
  },
  shareId: { type: String, unique: true },
}, { timestamps: true });

export const Form = mongoose.models.Form || mongoose.model("Form", formSchema);
