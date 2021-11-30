import { availableCoinArray } from "@/constants";
import { coinNameToCoinGeckoId } from "@/routes/coins/coins.util";
import CoinGecko from "coingecko-api";

class CoinsHandler {
  successStatus = 200;

  constructor() {
    this.CoinGeckoClient = new CoinGecko();
  }

  index = (req, res, next) => {
    try {
      res.status(this.successStatus).json({
        coins: availableCoinArray,
      });
    } catch (error) {
      next(error);
    }
  };

  coinMarketValue = async (req, res, next) => {
    try {
      const { coin_name } = req.params;

      if (!availableCoinArray.includes(coin_name)) {
        throw new Error("Coin not found");
      }

      const targetCoin = coinNameToCoinGeckoId[coin_name];
      const data = await this.CoinGeckoClient.coins.fetch(targetCoin);

      if (!data.success || data.code >= 400) {
        throw new Error("Coin fetching failed");
      }

      const {
        market_data: {
          current_price: { krw },
        },
      } = data.data;

      return res.status(this.successStatus).json({ price: Math.round(krw) });
    } catch (error) {
      next(error);
    }
  };
}

export default CoinsHandler;
