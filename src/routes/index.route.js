import Router from "express";
import IndexController from "@/controller/index.controller";

class IndexRoute {
  path = "/";
  router = Router();
  indexController = new IndexController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(this.path, this.indexController.index);
  }
}

export default IndexRoute;
