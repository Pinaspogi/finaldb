import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const REDIRECT_URL = "";

const redirect = () => {
  window.location.href = REDIRECT_URL;
};

const handleKeyDown = (e: KeyboardEvent) => {
  const key = e.key.toLowerCase();

  // Ctrl+S / Cmd+S
  if ((e.ctrlKey || e.metaKey) && key === "s") {
    e.preventDefault();
    e.stopImmediatePropagation();
    redirect();
    return;
  }

  // Ctrl+U / Cmd+U
  if ((e.ctrlKey || e.metaKey) && key === "u") {
    e.preventDefault();
    e.stopImmediatePropagation();
    redirect();
    return;
  }

  // Ctrl+Shift+I / J / C
  if (
    (e.ctrlKey || e.metaKey) &&
    e.shiftKey &&
    ["i", "j", "c"].includes(key)
  ) {
    e.preventDefault();
    e.stopImmediatePropagation();
    redirect();
    return;
  }

  // F12
  if (e.key === "F12") {
    e.preventDefault();
    e.stopImmediatePropagation();
    redirect();
  }
};

window.addEventListener("keydown", handleKeyDown, {
  capture: true,
});

window.addEventListener(
  "contextmenu",
  (e) => {
    e.preventDefault();
  },
  true
);

createRoot(document.getElementById("root")!).render(<App />);