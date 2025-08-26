import React from "react";
import ReactDOM from "react-dom/client";
import "./app/styles/global.css";
import { ThemeModeProvider } from "./app/providers/theme";
import { AppRouter } from "./app/router";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeModeProvider>
            <AppRouter />
        </ThemeModeProvider>
    </React.StrictMode>,
);
