import mongoose from "mongoose";
const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref :  "Rooms"
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
export const Message = mongoose.model("Message", messageSchema);
