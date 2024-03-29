import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@picocss/pico/css/pico.min.css";
import { BrowserRouter } from "react-router-dom";
import "./interceptors/axios";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
);
