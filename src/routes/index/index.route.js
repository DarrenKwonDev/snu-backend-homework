import Router from "express";
import IndexHandler from "@/routes/index/index.handler";
import authCheckMiddleware from "@/middleware/authCheck.middleware";

class IndexRoute {
  path = "";
  router = Router();
  indexHandler = new IndexHandler();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get(`${this.path}/`, this.indexHandler.index);
    this.router.post(`${this.path}/register`, this.indexHandler.register);
    this.router.post(`${this.path}/login`, this.indexHandler.login);

    // FIXME: user athentication이 필요한데 GET이어야할 이유를 모르겠습니다. body에 토큰을 담아 넘기는게 일반적이므로 POST여야 맞는 것 같아요
    this.router.post(
      `${this.path}/assets`,
      authCheckMiddleware,
      this.indexHandler.assets
    );
  }
}

export default IndexRoute;
