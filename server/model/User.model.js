import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide unique Username"],
        unique: [true, "Username Already Exist!"],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    email: {
        type: String,
        required: [true, "Please provide a unique email"],
        unique: [true, "Email Already Registered!"],
    },
    firstName: { type: String },
    lastName: { type: String },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String }
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);