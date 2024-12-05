import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    size: Number,
    fileId: String, // Reference to GridFS file ID
});

const File = mongoose.models.File || mongoose.model('File', fileSchema);

export default File;
