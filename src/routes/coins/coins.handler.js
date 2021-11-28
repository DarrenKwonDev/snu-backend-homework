class CoinsHandler {
  status = 200;

  index = (req, res, next) => {
    try {
      res.status(200).send(`welcome. this is snu-coin-backend homework ☀️`);
    } catch (error) {
      next(error);
    }
  };
}

export default CoinsHandler;
