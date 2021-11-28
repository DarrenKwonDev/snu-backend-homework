import Router from "express";
import IndexHandler from "@/routes/index/index.handler";

class IndexRoute {
  path = "/";
  router = Router();
  indexHandler = new IndexHandler();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(this.path, this.indexHandler.index);
    this.router.post(this.path, this.indexHandler.register);
  }
}

export default IndexRoute;
