import express from "express";

import {
  authorization,
  holdingsData,
  sellStock,
  buyStock,
  postBack,
  livePrice,
} from "./controller/authController.js";

const app = express();
const port = 8000;

app.get("/test", (req, res) => {
  res.status(200).send({ success: true, message: "message from server" });
});

app.get("/api/v1/auth", authorization);
app.get("/api/v1/holding", holdingsData);
app.get("/api/v1/sell", sellStock);
app.get("/api/v1/buy", buyStock);
app.get("/api/v1/postback", postBack);
app.get("/api/v1/price", livePrice);

app.listen(port, console.log(`server connected to ${port}`));
