/**
 * Database connection setup using Mongoose
 */
import mongoose from "mongoose";
import { config } from "./config";
import logger from "../utils/logger";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoURI); 
 
    logger.info(`MongoDB Connected:========== ${conn.connection.name}==============`); 
  } catch (error) {
    const err = error as Error;
    logger.error(`===================: ${err.message}===================`);
    process.exit(1);
  }
};
