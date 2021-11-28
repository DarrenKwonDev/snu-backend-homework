import "dotenv/config";
import App from "@/app.js";
import validateEnv from "@/utils/validateEnv";
import IndexRoute from "@/routes/index/index.route";
import CoinsRoute from "@/routes/coins/coins.route";

validateEnv();

const app = new App([new IndexRoute(), new CoinsRoute()]);

app.listen();
