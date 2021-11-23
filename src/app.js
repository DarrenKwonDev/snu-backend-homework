import express from "express";
import morgan from "morgan";
import cors from "cors";
import hpp from "hpp";
import helmet from "helmet";
import mongoose from "mongoose";
import { ENV } from "@/constants";
import errorMiddleware from "@/middleware/error.middleware";

class App {
  constructor(routes) {
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
    this.initializeRoutes(routes);
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

  initializeRoutes(routes) {
    // 보통 여기에 API_VER 넣는데 여기서는 필요 없을 것 같아서 뺐어용
    routes.forEach((route) => {
      this.app.use(`/`, route.router);
    });
  }

  initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
export default App;
