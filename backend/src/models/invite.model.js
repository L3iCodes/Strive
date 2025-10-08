import mongoose from "mongoose";
const { Schema } = mongoose;

const InviteSchema = new Schema(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true},
    board: { type:  Schema.Types.ObjectId, ref: "Board", required: true },
  },
  { timestamps: true }
);

const Invite = mongoose.model("Invite", InviteSchema);
export default Invite;