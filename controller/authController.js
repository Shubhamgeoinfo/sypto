import UpstoxClient from "upstox-js-sdk";
import axios from "axios";
import protobuf from "protocol-buffers";
import { Buffer } from "buffer";
import proto from "./marketFeed.proto";

const defaultClient = UpstoxClient.ApiClient.instance;
let OAUTH2 = defaultClient.authentications["OAUTH2"];

export const authorization = async (req, res) => {
  try {
    let apiInstance = new UpstoxClient.LoginApi();
    let apiVersion = "2.0";
    // console.log(apiInstance);
    let opts = {
      code: "tXK65M",
      clientId: "902fc7d9-9b05-4260-928f-bf0e06119af3",
      clientSecret: "rnodw7teby",
      redirectUri: "http://localhost:8000/",
      grantType: "tXK65M",
    };
    apiInstance.token(apiVersion, opts, (error, data, response) => {
      console.log(
        "API called successfully. Returned data: " + JSON.stringify(data)
      );
      //   res.status(200).send("Auth controller working and token returned");
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error from authorization",
      error,
    });
  }
};

export const holdingsData = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      res.status(400).send({
        success: false,
        message: "Token not found",
      });
    }
    OAUTH2.accessToken = token;
    let apiInstance = new UpstoxClient.PortfolioApi();
    let apiVersion = "2.0";
    apiInstance.getHoldings(apiVersion, (error, data, response) => {
      if (error) {
        console.log(error);
      } else {
        res.status(200).send(data);
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error from getting holdings",
      error,
    });
  }
  return res;
};

export const sellStock = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      res.status(400).send({
        success: false,
        message: "Token not found",
      });
    }
    OAUTH2.accessToken = token;
    let apiInstance = new UpstoxClient.OrderApi();
    let body = new UpstoxClient.PlaceOrderRequest(
      1,
      UpstoxClient.PlaceOrderRequest.ProductEnum.D,
      UpstoxClient.PlaceOrderRequest.ValidityEnum.DAY,
      0.0,
      "NSE_EQ|INE528G01035",
      UpstoxClient.PlaceOrderRequest.OrderTypeEnum.MARKET,
      UpstoxClient.PlaceOrderRequest.TransactionTypeEnum.SELL,
      0,
      0.0,
      false
    );
    let apiVersion = "2.0";

    apiInstance.placeOrder(body, apiVersion, (error, data, response) => {
      if (error) {
        console.error(error.response.text);
      } else {
        console.log("API called successfully. Returned data: " + data);
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error from getting holdings",
      error,
    });
  }
  return res;
};


export const buyStock = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      res.status(400).send({
        success: false,
        message: "Token not found",
      });
    }
    OAUTH2.accessToken = token;
    let apiInstance = new UpstoxClient.OrderApi();
    let body = new UpstoxClient.PlaceOrderRequest(
      1,
      UpstoxClient.PlaceOrderRequest.ProductEnum.D,
      UpstoxClient.PlaceOrderRequest.ValidityEnum.DAY,
      0.0,
      "NSE_EQ|INE528G01035",
      UpstoxClient.PlaceOrderRequest.OrderTypeEnum.MARKET,
      UpstoxClient.PlaceOrderRequest.TransactionTypeEnum.BUY,
      0,
      0.0,
      false
    );
    let apiVersion = "2.0";

    apiInstance.placeOrder(body, apiVersion, (error, data, response) => {
      if (error) {
        console.error(error.response.text);
      } else {
        console.log("API called successfully. Returned data: " + data);
      }
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error from getting holdings",
      error,
    });
  }
  return res;
};

export const postBack = async (req, res) => {
  try {
    res.status(200).send("Success in postBack");
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while postBack",
      error,
    });
  }
};

export const livePrice = async (req, res) => {
    let isConnected = false;
    let feedData = [];
    let protobufRoot = null;
    const token = req.query.token;
    if (!token) {
      res.status(400).send({
        success: false,
        message: "Token not found",
      });
    }
    const initProtobuf = async () => {
      protobufRoot = await protobuf.load(proto);
      console.log("Protobuf part initialization complete");
    };

    const getUrl = async () => {
      const apiUrl = "https://api-v2.upstox.com/feed/market-data-feed/authorize";
      let headers = {
        "Content-type": "application/json",
        Authorization: "Bearer " + token,
      };
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const res = await response.json();
      return res.data.authorizedRedirectUri;
    };
    const connectWebSocket = async () => {
      try {
        const wsUrl = await getUrl();
        const ws = new WebSocket(wsUrl);
        ws.onopen = () => {
          isConnected = true;
          console.log("Connected");
          const data = {
            guid: "someguid",
            method: "sub",
            data: {
              mode: "full",
              instrumentKeys: ["NSE_EQ|INE669E01016"],
            },
          };
          ws.send(Buffer.from(JSON.stringify(data)));
        };

        ws.onclose = () => {
          isConnected = false;
          console.log("Disconnected");
        };

        ws.onmessage = async (event) => {
          const arrayBuffer = await blobToArrayBuffer(event.data);
          let buffer = Buffer.from(arrayBuffer);
          let response = decodeProfobuf(buffer);
          feedData.push(JSON.stringify(response));
        };

        ws.onerror = (error) => {
          isConnected = false;
          console.log("WebSocket error:", error);
        };

        return () => ws.close();
      } catch (error) {
        console.error("WebSocket connection error:", error);
      }
    };
    initProtobuf();
    connectWebSocket();
};
