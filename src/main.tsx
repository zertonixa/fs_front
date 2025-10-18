import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/index.tsx";
import "./shared/config/styles/index.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
