import Router from "express";
import IndexHandler from "@/routes/index/index.handler";
import authCheckMiddleware from "@/middleware/authCheck.middleware";

class IndexRoute {
  path = "";
  router = Router();
  indexHandler = new IndexHandler();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/`, this.indexHandler.index);
    this.router.post(`${this.path}/register`, this.indexHandler.register);
    this.router.post(`${this.path}/login`, this.indexHandler.login);

    this.router.get(
      `${this.path}/assets`,
      authCheckMiddleware,
      this.indexHandler.assets
    );
  }
}

export default IndexRoute;
