import "./App.css";
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { RedirectedPath } from "./pages/RedirectedPath/RedirectedPath";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<RedirectedPath />} />
    </Routes>
  );
}

export default App;
