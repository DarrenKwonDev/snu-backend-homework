import jwt from "jsonwebtoken";

const authCheckMiddleware = (req, res, next) => {
  let decodedPayload;
  try {
    const { authorization: token } = req.headers;

    if (!token) {
      throw new Error("authorization header is required");
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) throw new Error("invalid token");
      decodedPayload = decoded;
    });

    if (!decodedPayload.email) {
      throw new Error("token is not valid");
    }

    req.email = decodedPayload.email;
    next();
  } catch (error) {
    next(error);
  }
};

export default authCheckMiddleware;
