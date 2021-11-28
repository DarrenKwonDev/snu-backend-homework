import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    token: {
      type: String,
    },
    assets: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assets",
    },
  },
  {
    timestamps: true,
  }
);

const Users = mongoose.model("Users", userSchema);

export default Users;
