import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { MantineProvider } from "@mantine/core";
import store from "./store/store";

const containerElement = document.getElementById("root");

if (containerElement) {
  const root = ReactDOM.createRoot(containerElement);

  root.render(
    <Provider store={store}>
      <MantineProvider
        // theme={{ colorScheme: "light" }}
        // withGlobalStyles
        // withNormalizeCSS
      >
        <App />
      </MantineProvider>
    </Provider>
  );
} else {
  console.error("Root element not found");
}
