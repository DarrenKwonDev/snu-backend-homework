import mongoose from "mongoose";

const assetsSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  dollar: {
    type: Number,
    default: 10000,
  },
  btc: {
    type: Number,
    default: 0,
  },
  eth: {
    type: Number,
    default: 0,
  },
  xrp: {
    type: Number,
    default: 0,
  },
  doge: {
    type: Number,
    default: 0,
  },
  sol: {
    type: Number,
    default: 0,
  },
  dot: {
    type: Number,
    default: 0,
  },
});

const Assets = mongoose.model("Assets", assetsSchema);

export default Assets;
