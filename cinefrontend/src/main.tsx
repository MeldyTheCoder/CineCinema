import { createRoot } from "react-dom/client";
import { Index } from "./pages/index";
import { Film } from "./pages/film";
import { Login } from "./pages/login";
import { Provider } from "./components/ui/provider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { authenticateFx } from "./effector/users.store";
import { LocaleProvider } from "@chakra-ui/react";
import { attachLogger } from 'effector-logger';
import { ProfileLayout } from "./pages/profile-layout";
import { ProfileSettings } from "./pages/profile-pages/settings";
import { ProfilePurchases } from "./pages/profile-pages/purchases";
import { ProfileBonuses } from "./pages/profile-pages/bonuses";
import { Support } from "./pages/profile-pages/support";
import { checkIsAdultEv } from "./effector/age.store";
import { FilmNew } from "./pages/film-new";
import { Registration } from "./pages/registration";

attachLogger();

function renderRoot() {
  createRoot(document.getElementById("root")!).render(
    <LocaleProvider locale="ru-RU">
      <Provider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Index} />
            <Route path="/film/deprecated/:filmId" Component={Film} />
            <Route path="/film/:filmId" Component={FilmNew} />
            <Route path="/login/" Component={Login} />
            <Route path="/registration/" Component={Registration} />
            <Route path="/profile/" element={<ProfileLayout />}>
              <Route index element={<ProfileSettings />} />
              <Route path="purchases" element={<ProfilePurchases />} />
              <Route path="bonuses" element={<ProfileBonuses />} />
              <Route path="reviews" element={<div />} />
              <Route path="support" Component={Support} />
              <Route path="*" element={<span>Ничего не найдено!</span>} />
            </Route>
            {/* <Route path="/order/" Component={CreateOrder} /> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </LocaleProvider>
  );
}

const accessToken = localStorage.getItem("accessToken");
const tokenType = localStorage.getItem("tokenType");
checkIsAdultEv();

if (accessToken && tokenType) {
  authenticateFx({ accessToken, tokenType }).then(() => renderRoot());
} else {
  renderRoot();
}
