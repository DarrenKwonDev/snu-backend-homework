import { cleanEnv, port, str, num } from "envalid";

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ["development", "production"] }),
    PORT: port(),
    DB_ENDPOINT: str(),
    DB_USERNAME: str(),
    DB_PASSWORD: num(),
    DB_PORT: num(),
  });
};

export default validateEnv;
