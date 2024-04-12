import UpstoxClient from "upstox-js-sdk";
import axios from "axios";

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
    res.status(200).send("holdings");
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error from getting holdings",
      error,
    });
  }
};

export const sellStock = async (req, res) => {
  try {
    res.status(200).send("Stock Sold");
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error from sell stock ",
      error,
    });
  }
};

export const buyStock = async (req, res) => {
  try {
    res.status(200).send("Stock buy");
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error while buying stock",
    });
  }
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
  try {
    res.status(200).send("success in live price");
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "error in live price",
      error,
    });
  }
};
