import mongoose from "mongoose";
const { Schema } = mongoose;

const NotificationSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true},
    board: { type:  Schema.Types.ObjectId, ref: "Board", required: true },
    type: { type: String, enum: ['message', 'invite'], required: true },
    message: { type: String }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;