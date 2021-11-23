class IndexController {
  index = (req, res, next) => {
    try {
      res.status(200).send(`welcome. this is snu-coin-backend homework me~~~`);
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
