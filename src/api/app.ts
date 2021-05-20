import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Server } from "http";

const app = express();
const server = new Server(app);

app.use(cors());
app.use(helmet());

export { app, server };
