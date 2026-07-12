const helmet = require("helmet");
const cors = require("cors");

const securityMiddleware = (app) => {
  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CLIENT_URL || "*",
      credentials: true,
    })
  );
};

module.exports = securityMiddleware;