import mongoose from "mongoose";
const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String},
    boards: [
        {
            _id: { type: Schema.Types.ObjectId, ref: "Board" },
            lastOpened: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
export default User;