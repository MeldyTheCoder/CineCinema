import React, { useEffect, useState } from "react";
import { sendAuthCodeFx, loginFx } from "../../effector/users.store";
import { toaster } from "../ui/toaster";
import { AuthFormContainer } from "./auth-form-container";
import { CodeInputStage } from "./code-stage";
import { LoginPhoneStage } from "./phone-input-stage";

export function LoginForm() {
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");

  const [phone, setPhone] = useState<string>("");

  const handlePhoneSubmit = (phone: string) => {
    setPhone(phone);
    sendAuthCodeFx({ phone })
      .then((status) => setCodeSent(status))
      .catch(({ response }) => setPhoneError(response.data.detail));
  };

  const handleCodeSubmit = (code: string) => {
    loginFx({ phone, code })
      .then(() =>
        toaster.create({ title: "Вы успешно вошли!", type: "success" })
      )
      .catch(({ response }) => setCodeError(response.data.detail));
  };

  return (
    <AuthFormContainer onBack={!!codeSent ? () => setCodeSent(false) : undefined}>
      {!codeSent ? (
        <LoginPhoneStage
          error={phoneError}
          onSubmit={handlePhoneSubmit}
          onError={(error) => setPhoneError(error)}
        />
      ) : (
        <CodeInputStage
          error={codeError}
          onSubmit={handleCodeSubmit}
          onError={(error) => setCodeError(error)}
        />
      )}
    </AuthFormContainer>
  );
}
