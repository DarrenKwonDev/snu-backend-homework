import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/routes/index/index.util";
import Users from "@/models/Users";
import jwt from "jsonwebtoken";
import Keys from "@/models/Keys";
import Assets from "@/models/Assets";

class IndexHandler {
  successStatus = 200;

  index = (req, res, next) => {
    try {
      res
        .status(this.successStatus)
        .json(`welcome. this is snu-coin-backend homework ☀️`);
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      console.log(name, email, password);

      if (!name || !email || !password) {
        throw new Error("missing required fields");
      }

      if (!validateName(name)) {
        throw new Error(
          "Name must be 4-12 characters long and only contain letters and numbers"
        );
      }

      if (!validateEmail(email)) {
        throw new Error("email should under 100 letters and valid");
      }

      if (!validatePassword(password)) {
        throw new Error(
          "password should be string and more than 8 letters and less than 16 leters"
        );
      }

      const existedUser = await Users.findOne({ email });

      if (existedUser) {
        throw new Error("user already existed");
      }

      const token = jwt.sign({ password }, process.env.JWT_SECRET);

      const newUser = new Users({
        name,
        email,
      });

      const newKeys = new Keys({
        owner: newUser._id,
        publicKey: token,
        secretKey: process.env.JWT_SECRET,
      });

      const newAssets = new Assets({
        owner: newUser._id,
      });

      newUser.save();
      newKeys.save();
      newAssets.save();

      // FIXME: 과제 요건 때문에 이렇게 하는 것이지 실제로는 scretKey를 노출하면 안된다!
      res.status(this.successStatus).json({
        publicKey: token,
        secretKey: process.env.JWT_SECRET,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    let decodedPayload;

    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new Error("missing required fields");
      }

      const existedUser = await Users.findOne({ email });

      if (!existedUser) {
        throw new Error("user not existed");
      }

      jwt.verify(existedUser.token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) throw new Error("invalid token");
        decodedPayload = decoded;
      });

      const isPasswordCorrect = decodedPayload.password === password;
      if (!isPasswordCorrect) {
        throw new Error("password wrong");
      }

      res.status(this.successStatus).json({
        key: existedUser.token,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexHandler;
