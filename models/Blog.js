import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: String,
  date: String,
  description: String,
  url: String
});

export default mongoose.model('Blog', blogSchema);
