import mongoose from "mongoose";

const keysSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  publicKey: {
    type: String,
  },
  secretKey: {
    type: String,
  },
});

const Keys = mongoose.model("Keys", keysSchema);

export default Keys;
