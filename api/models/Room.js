import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    subject: String,
    admin: String,
    email: String
});

const Room = mongoose.model('Room', schema);
export default Room;