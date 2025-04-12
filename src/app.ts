import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import logger from "./utils/logger";
import { notFound } from "./middleware/not-fount";
import { errorHandler } from "./middleware/error-handler";
import router from "./routes";
// import { logger } from './utils/logger';

const app = express();

// middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limit
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// routes
app.use("/api/v1", router); 

//error handler
app.use(notFound);
app.use(errorHandler);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  logger.error(
    `-------------------------- ${err.message}----------------------------`
  );
  logger.error(err.stack);
  // Close server & exit process
  process.exit(1);
});

export default app;
