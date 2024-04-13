import React, { useEffect } from "react";

export const Home = () => {
  const clientId = "$ClientId";
  const redirectUri = "http://localhost:8000/home";

  useEffect(() => {
    window.open(
      `https://api.upstox.com/v2/login/authorization/dialog?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`,
      "_self"
    );
  });

  return <div>Home</div>;
};
