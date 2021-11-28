import CoinGecko from "coingecko-api";

class CoinsHandler {
  successStatus = 200;

  constructor() {
    this.CoinGeckoClient = new CoinGecko();
  }

  index = (req, res, next) => {
    try {
      res.status(this.successStatus).json({
        coins: ["btc", "xrp", "doge", "eth"],
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CoinsHandler;
