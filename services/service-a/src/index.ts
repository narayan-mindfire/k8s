import express, { type Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes";

const port = process.env.PORT;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", router);

app.listen(port, () => {});

export default app;
