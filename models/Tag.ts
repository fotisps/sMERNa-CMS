import mongoose from 'mongoose';

const TagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the tag'],
    unique: true,
    maxlength: [30, 'Name cannot be more than 30 characters'],
  },
});

export default mongoose.models.Tag || mongoose.model('Tag', TagSchema);