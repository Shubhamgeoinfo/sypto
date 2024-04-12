import React, { useEffect } from "react";

export const Home = () => {
  const clientId = "902fc7d9-9b05-4260-928f-bf0e06119af3";
  const redirectUri = "http://localhost:8000/home";

  useEffect(() => {
    window.open(
      `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`,
      "_self"
    );
  });

  return <div>Home</div>;
};
