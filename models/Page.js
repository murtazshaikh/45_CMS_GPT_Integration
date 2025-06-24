// models/Page.js
import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  meta_title: String,
  meta_description: String,
  keywords: [String],
});

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
