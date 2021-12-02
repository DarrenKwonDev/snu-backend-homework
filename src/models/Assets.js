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
  bitcoin: {
    type: Number,
    default: 0,
  },
  ethereum: {
    type: Number,
    default: 0,
  },
  ripple: {
    type: Number,
    default: 0,
  },
  dogecoin: {
    type: Number,
    default: 0,
  },
  solana: {
    type: Number,
    default: 0,
  },
  polkadot: {
    type: Number,
    default: 0,
  },
});

const Assets = mongoose.model("Assets", assetsSchema);

export default Assets;
