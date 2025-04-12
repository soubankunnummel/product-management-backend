import app from "./app";
import { connectDB } from "./config/db";

const startServer = async () => {
  process.nextTick(async () => {
    await connectDB();
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server is running on port ${process.env.PORT || 8080}`);
    });
  });
};

startServer();
