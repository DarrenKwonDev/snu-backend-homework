import {
  validateEmail,
  validateName,
  validatePassword,
} from "@/routes/index/index.util";
import Users from "@/models/Users";
import jwt from "jsonwebtoken";

class IndexHandler {
  status = 200;

  index = (req, res, next) => {
    try {
      res.status(200).json(`welcome. this is snu-coin-backend homework ☀️`);
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

      const token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      const newUser = new Users({
        name,
        email,
      });

      newUser.save();

      res.status(200).json({
        success: true,
        token,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexHandler;
