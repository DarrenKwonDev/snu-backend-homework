import Router from "express";
import CoinsHandler from "@/routes/coins/coins.handler";
import authCheckMiddleware from "@/middleware/authCheck.middleware";

class CoinsRoute {
  path = "/coins";
  router = Router();
  coinsHandler = new CoinsHandler();

  constructor() {
    this.initializeRoutes();
  }

  // FIXME: js면 coin_name보다 coinName이 더 적합할 것 같은데 과제 요건에 따름
  initializeRoutes() {
    this.router.get(`${this.path}`, this.coinsHandler.index);
    this.router.get(
      `${this.path}/:coin_name`,
      this.coinsHandler.coinMarketValue
    );
    this.router.post(
      `${this.path}/:coin_name/buy`,
      authCheckMiddleware,
      this.coinsHandler.buyCoin
    );
    this.router.post(
      `${this.path}/:coin_name/sell`,
      authCheckMiddleware,
      this.coinsHandler.sellCoin
    );
  }
}

export default CoinsRoute;
