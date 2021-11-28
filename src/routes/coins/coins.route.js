import Router from "express";
import CoinsHandler from "@/routes/coins/coins.handler";

class CoinsRoute {
  path = "/coins";
  router = Router();
  coinsHandler = new CoinsHandler();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}`, this.coinsHandler.index);
  }
}

export default CoinsRoute;
