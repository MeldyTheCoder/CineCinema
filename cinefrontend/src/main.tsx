import { createRoot } from "react-dom/client";
import { Index } from "./pages/index";
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
import { Film } from "./pages/film";
import { Registration } from "./pages/registration";
import { SuccessPayment } from "./pages/success-payment";
import { PaymentRedirect } from "./pages/payment-redirect";
import { CashPaymentInstructions } from "./pages/cash-instructions";
import { Page404 } from "./pages/404";

attachLogger();

function renderRoot() {
  createRoot(document.getElementById("root")!).render(
    <LocaleProvider locale="ru-RU">
      <Provider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" Component={Index} />
            <Route path="/film/:filmId" Component={Film} />
            <Route path="/login/" Component={Login} />
            <Route path="/registration/" Component={Registration} />
            <Route path="/redirect/payment/:paymentId" Component={PaymentRedirect} />
            <Route path="/success-payment/" Component={SuccessPayment} />
            <Route path="/cash-payment-instruction/" Component={CashPaymentInstructions} />
            <Route path="/profile/" element={<ProfileLayout />}>
              <Route index element={<ProfileSettings />} />
              <Route path="purchases" element={<ProfilePurchases />} />
              <Route path="bonuses" element={<ProfileBonuses />} />
              <Route path="reviews" element={<div />} />
              <Route path="support" Component={Support} />
              <Route path="*" element={<span>Ничего не найдено!</span>} />
            </Route>
            {/* <Route path="/order/" Component={CreateOrder} /> */}
            <Route path="*" Component={Page404} />
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
