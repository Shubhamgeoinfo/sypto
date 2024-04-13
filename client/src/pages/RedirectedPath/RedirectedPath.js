import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { clientId, clientSecret, grantType } from "../../const";

export const RedirectedPath = () => {
  const [name, setName] = useState("");
  const [accessToken, setAssetToken] = useState(null);

  const getToken = (code) => {
    axios
      .post(
        tokenApi,
        {
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: "http://localhost:8000/home",
          grant_type: grantType,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log({ res });
        setName(res?.data?.user_name);
        setAssetToken(res?.data?.access_token);
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const getHoldings = () => {
    axios.get("http://localhost:8001/api/v1/holding?token=" + accessToken).then((res) => {
      console.log({ res });
    }).catch((err) => {console.log({ err }) });
  };

  const getLivePrices = () => {
    axios.get("http://localhost:8001/api/v1/price?token=" + accessToken).then((res) => {
      console.log({ res });
    }).catch((err) => {console.log({ err }) });
  };

  const tokenApi = "https://api.upstox.com/v2/login/authorization/token";
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const currentCode = searchParams.get("code");
    getToken(currentCode);
  }, [searchParams]);
  return (
    <>
      <h1>Upstox-Client</h1>
      <h3>Hi, {name}</h3>
      <div>
        <button onClick={getHoldings}>Get Holdings</button>
        <button onClick={getLivePrices}>Get Live Price</button>
      </div>
    </>
  );
};
