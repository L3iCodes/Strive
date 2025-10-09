import mongoose from "mongoose";
const { Schema } = mongoose;

const BoardSchema = new Schema({
    name: { type: String, required: true },
    desc: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    collaborators: [{
        inviteId: { type: Schema.Types.ObjectId, ref: "Notification" },
        user: { type: Schema.Types.ObjectId, ref: "User" },
        status: { type: String, enum: ['pending', 'accepted'] },
        role: { type: String, enum: ['viewer', 'editor'] }
    }],
    sections: [{ type: Schema.Types.ObjectId, ref: "Section" }],
    activities: [{ type : Schema.Types.ObjectId, ref: "Activity" }]
}, { timestamps: true });

const Board = mongoose.model("Board", BoardSchema);
export default Board