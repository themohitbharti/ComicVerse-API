import express from 'express';
import cors from "cors";
import rateLimit from "express-rate-limit";
import logger from "morgan";
import  bookRoutes from "./routes/book.routes";

const app = express();

const limiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 2500, // limit each IP to 2500 requests per windowMs
  });

  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use(limiter);
app.set("trust proxy", 1);


app.use("/api/v1/book", bookRoutes);

export {app}