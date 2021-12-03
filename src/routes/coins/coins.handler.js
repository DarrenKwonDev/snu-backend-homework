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
      let { quantity, all } = req.body;

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
          current_price: { usd: coinValue },
        },
      } = data.data;

      const user = req.user;
      const userAssets = await Assets.findOne({ owner: user._id });

      const session = await mongoose.startSession();
      session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      });

      if (Boolean(all)) {
        if (quantity) {
          throw new Error("You can't buy all coins with quantity");
        }

        const maxiumCoinQuantity = Math.floor(userAssets.dollar / coinValue);

        console.log("maxiumCoinQuantity", maxiumCoinQuantity);

        if (!Boolean(maxiumCoinQuantity)) {
          throw new Error("You don't have enough money");
        }

        const requiredUsd = coinValue * maxiumCoinQuantity;

        userAssets.dollar -= requiredUsd;
        userAssets[coin_name] += maxiumCoinQuantity;
        await userAssets.save();

        session.commitTransaction();
        session.endSession();

        return res.status(this.successStatus).json({
          price: coinValue,
          quantity: maxiumCoinQuantity,
        });
      }

      if (!Boolean(all)) {
        quantity = parseFloat(quantity);

        if (!quantityDecimalPointsCheck(quantity)) {
          throw new Error("quantity decimal points are more than 4");
        }

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
      }
    } catch (error) {
      next(error);
    }
  };

  sellCoin = async (req, res, next) => {
    try {
      const { coin_name } = req.params;
      let { quantity, all } = req.body;

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
          current_price: { usd: coinValue },
        },
      } = data.data;

      const user = req.user;
      const userAssets = await Assets.findOne({ owner: user._id });

      const session = await mongoose.startSession();
      session.startTransaction({
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      });

      if (Boolean(all)) {
        if (quantity) {
          throw new Error("You can't buy sell coins with quantity");
        }

        const maxiumCoinQuantity = userAssets[coin_name];

        console.log("maxiumCoinQuantity", maxiumCoinQuantity);

        if (!Boolean(maxiumCoinQuantity)) {
          throw new Error("You don't have enough coins");
        }

        const coinValueAsDollar = coinValue * maxiumCoinQuantity;

        userAssets.dollar += coinValueAsDollar;
        userAssets[coin_name] -= maxiumCoinQuantity;
        await userAssets.save();

        session.commitTransaction();
        session.endSession();

        return res.status(this.successStatus).json({
          price: coinValue,
          quantity: maxiumCoinQuantity,
        });
      }

      if (!Boolean(all)) {
        quantity = parseFloat(quantity);

        if (!quantityDecimalPointsCheck(quantity)) {
          throw new Error("quantity decimal points are more than 4");
        }

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
      }
    } catch (error) {
      next(error);
    }
  };
}

export default CoinsHandler;
