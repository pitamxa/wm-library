import { createRoot } from "react-dom/client";
import "@wm/ui-library/style.css";
import "./styles/app.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
