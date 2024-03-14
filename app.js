const cors = require('cors');
const express = require("express");
const apiRouter = require("./routers/api.router");
const app = express();
const {
  serverErrors,
  customErrors,
  psqlErrors
} = require("./controllers/errors.controllers");


app.use(cors());

app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);

module.exports = app;
