import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PicksProvider } from "./context/PicksContext";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <PicksProvider>
        <App />
      </PicksProvider>
    </BrowserRouter>
  </StrictMode>
);

