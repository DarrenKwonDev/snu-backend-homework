import "dotenv/config";
import App from "@/app.js";
import validateEnv from "@/utils/validateEnv";

validateEnv();

const app = new App();

app.listen();
