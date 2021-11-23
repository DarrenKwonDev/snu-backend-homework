import express from "express";
import morgan from "morgan";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import { ENV } from "@/constants";
import errorMiddleware from "@/middleware/error.middleware";
import mongoose from "mongoose";

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.env = process.env.NODE_ENV;
    this.edEndPoint = process.env.DB_ENDPOINT;
    this.dbUser = process.env.DB_USERNAME;
    this.dbPassword = process.env.DB_PASSWORD;
    this.dbPort = process.env.DB_PORT;

    // 순서 중요. DB를 처음에 배치. cors해결을 위해 미들웨어를 라우트 이전에 배치할 것.
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeErrorHandling();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.debug(
        `NODE_ENV: ${this.env}, server on : http://localhost:${this.port}`
      );
    });
  }

  getServer() {
    return this.app;
  }

  initializeMiddlewares() {
    if (this.env === ENV.PRODUCTION) {
      this.app.use(morgan("combined"));
      this.app.use(cors({ origin: "your.domain.com", credentials: true })); // 응 안해
    } else if (this.env === ENV.DEVELOPMENT) {
      this.app.use(morgan("dev"));
      this.app.use(cors({ origin: true, credentials: true }));
    }

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  connectToDatabase() {
    if (this.env === ENV.DEVELOPMENT) {
      mongoose.set("debug", true);
    }

    mongoose
      .connect("mongodb://localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("mongodb connected"))
      .catch((err) => console.error(err));
  }

  initializeRoutes() {}

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
export default App;
