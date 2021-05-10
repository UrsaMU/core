const express = require("express");
const { createServer } = require("http");
const cors = require("cors");
const helmet = require("helmet");

const app = express();
const server = createServer(app);

app.use(cors());
app.use(helmet());

module.exports.app = app;
module.exports.server = server;
