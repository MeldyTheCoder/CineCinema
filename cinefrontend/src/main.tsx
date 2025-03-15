import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Index } from "./pages/index";
import { Film } from "./pages/film";
import { Login } from "./pages/login";
import { Provider } from "./components/ui/provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { authenticateFx } from "./effector/users.store";
import { LocaleProvider } from "@chakra-ui/react";

function renderRoot() {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <LocaleProvider locale="ru-RU">
        <Provider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" Component={Index} />
              <Route path="/film/:filmId" Component={Film} />
              <Route path="/login/" Component={Login} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </LocaleProvider>
    </StrictMode>
  );
}

const accessToken = localStorage.getItem("accessToken");
const tokenType = localStorage.getItem("tokenType");

if (accessToken && tokenType) {
  authenticateFx({ accessToken, tokenType }).then(() => renderRoot());
} else {
  renderRoot();
}
