import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    slug: String,
    subject: String,
    email: String
});

const Room = mongoose.model('Room', schema);
export default Room;