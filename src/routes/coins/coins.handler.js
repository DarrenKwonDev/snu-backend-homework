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

  buyCoin = async (req, res, next) => {
    try {
      const { coin_name } = req.params;
      if (!availableCoinArray.includes(coin_name)) {
        throw new Error("Coin not found");
      }
      // https://darrengwon.tistory.com/660

      session = db.getMongo().startSession();
      session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      });

      // TODO: coin 구매
      // TODO: 유저의 asset 정보에서 돈을 제거하고 코인을 추가하면 됨
      // 근거는 현재 gecko api의 가격

      session.commitTransaction();
      session.endSession();
    } catch (error) {
      next(error);
    }
  };

  sellCoin = async (req, res, next) => {
    const { coin_name } = req.params;
    if (!availableCoinArray.includes(coin_name)) {
      throw new Error("Coin not found");
    }
    // https://darrengwon.tistory.com/660

    session = db.getMongo().startSession();
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    // TODO: coin 판매
    // TODO: 유저의 asset 정보에서 코인을 제거하고 돈을 추가한다.
    // 근거는 현재 gecko api의 가격

    session.commitTransaction();
    session.endSession();
  };
}

export default CoinsHandler;
