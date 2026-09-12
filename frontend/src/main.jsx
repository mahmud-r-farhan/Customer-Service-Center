import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);

// Register service worker for basic PWA support in production only.
// Registering it during development can serve a stale cached app shell
// and make it confusing to see live code changes.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = "/sw.js";
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => console.log("Service worker registered:", reg.scope))
      .catch((err) => console.warn("Service worker registration failed:", err));
  });
}