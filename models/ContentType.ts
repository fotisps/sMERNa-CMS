import mongoose from 'mongoose';

const ContentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the content type'],
    unique: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  description: {
    type: String,
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
});

export default mongoose.models.ContentType || mongoose.model('ContentType', ContentTypeSchema);