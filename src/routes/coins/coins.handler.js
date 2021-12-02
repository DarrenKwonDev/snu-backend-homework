import { availableCoinArray } from "@/constants";
import Assets from "@/models/Assets";
import {
  coinNameToCoinGeckoId,
  quantityDecimalPointsCheck,
} from "@/routes/coins/coins.util";
import CoinGecko from "coingecko-api";
import mongoose from "mongoose";

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
          current_price: { usd },
        },
      } = data.data;

      return res.status(this.successStatus).json({ price: usd });
    } catch (error) {
      next(error);
    }
  };

  buyCoin = async (req, res, next) => {
    try {
      const { coin_name } = req.params;
      let { quantity } = req.body;
      quantity = parseFloat(quantity);

      if (!availableCoinArray.includes(coin_name)) {
        throw new Error("Coin not found");
      }

      if (!quantityDecimalPointsCheck(quantity)) {
        throw new Error("quantity decimal points are more than 4");
      }

      const targetCoin = coinNameToCoinGeckoId[coin_name];
      const data = await this.CoinGeckoClient.coins.fetch(targetCoin);

      if (!data.success || data.code >= 400) {
        throw new Error("Coin fetching failed");
      }

      const {
        market_data: {
          current_price: { usd: coinValue },
        },
      } = data.data;

      const session = await mongoose.startSession();
      session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      });

      const user = req.user;
      const userAssets = await Assets.findOne({ owner: user._id });
      const requiredUsd = coinValue * quantity;

      if (userAssets.dollar < requiredUsd) {
        throw new Error("Not enough money");
      }

      userAssets.dollar -= requiredUsd;
      userAssets[coin_name] += quantity;
      await userAssets.save();

      session.commitTransaction();
      session.endSession();

      return res.status(this.successStatus).json({
        price: coinValue,
        quantity,
      });
    } catch (error) {
      next(error);
    }
  };

  sellCoin = async (req, res, next) => {
    try {
      const { coin_name } = req.params;
      let { quantity } = req.body;
      quantity = parseFloat(quantity);

      if (!availableCoinArray.includes(coin_name)) {
        throw new Error("Coin not found");
      }

      if (!quantityDecimalPointsCheck(quantity)) {
        throw new Error("quantity decimal points are more than 4");
      }

      const targetCoin = coinNameToCoinGeckoId[coin_name];
      const data = await this.CoinGeckoClient.coins.fetch(targetCoin);

      if (!data.success || data.code >= 400) {
        throw new Error("Coin fetching failed");
      }

      const {
        market_data: {
          current_price: { usd: coinValue },
        },
      } = data.data;

      const session = await mongoose.startSession();
      session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      });

      const user = req.user;
      const userAssets = await Assets.findOne({ owner: user._id });
      const coinValueAsDollar = coinValue * quantity;

      if (userAssets[coin_name] < quantity) {
        throw new Error("Not enough coins");
      }

      userAssets.dollar += coinValueAsDollar;
      userAssets[coin_name] -= quantity;
      await userAssets.save();

      session.commitTransaction();
      session.endSession();

      return res.status(this.successStatus).json({
        price: coinValue,
        quantity,
      });
    } catch (error) {
      next(error);
    }
  };
}

export default CoinsHandler;
