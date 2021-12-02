export const coinNameToCoinGeckoId = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  ripple: "ripple",
  dogecoin: "binance-peg-dogecoin",
  solana: "solana",
  polkadot: "binance-peg-polkadot",
};

export const quantityDecimalPointsCheck = (value) => {
  const regex = /^\d+(\.\d{1,4})?$/;
  return regex.test(value);
};
