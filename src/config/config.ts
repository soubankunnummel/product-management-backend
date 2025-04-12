/**
 * Application configuration settings loaded from environment variables
 */
import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  mongoURI: string;
  jwtSecret: string;
  jwtExpire: string;
}

export const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),
  mongoURI: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
};
