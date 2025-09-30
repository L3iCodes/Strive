import mongoose from "mongoose";
const { Schema } = mongoose;

const ActivitySchema = new Schema(
  {
    board: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;