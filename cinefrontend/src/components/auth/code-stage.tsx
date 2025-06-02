import { useEffect, useState } from "react";
import { sendAuthCodeFx } from "../../effector/users.store";
import { toaster } from "../ui/toaster";
import { FormStageProps } from "./auth-form-container";
import {chakra, Stack, usePinInput, Heading, Text, PinInput, Button} from '@chakra-ui/react';
import { createCountdown } from "../../effector/timer.store";
import { MdSms } from "react-icons/md";

const CodeDescriptionsContainer = chakra(
  Stack,
  {
    base: {
      textAlign: "center",
    },
  },
  { defaultProps: { gap: 1 } }
);

export function CodeInputStage({ error, onError, onSubmit }: FormStageProps<string>) {
  const { tick, startTimer, resetTimer } = createCountdown("sms", 1000);
  const [time, setTime] = useState<number>(5 * 60);

  const handleResetErrorAfterTouch = () => {
    if (error) {
      onError?.("");
      pinInput.clearValue();
    }
  };

  const pinInput = usePinInput({
    otp: true,
    type: "numeric",
    onValueComplete: ({ valueAsString }) => {
      onSubmit?.(valueAsString);
    },
    onValueChange: handleResetErrorAfterTouch,
    invalid: !!error,
  });

  const handleResendCode = () => {
    sendAuthCodeFx({ phone: "1123343" }).then(() => {
      resetTimer();
      startTimer(5 * 60);
      toaster.create({
        title: "Код успешно отправлен на Ваш номер телефона!",
        type: "success",
      });
    });
  };

  useEffect(() => {
    const resetTickWatcher = tick.watch((data) => setTime(data));
    const resetTimerResetter = resetTimer.watch(() => setTime(0));

    startTimer(5 * 60);

    return () => {
      resetTickWatcher();
      resetTimerResetter();
    };
  }, []);

  return (
    <Stack gap={5} alignItems="center" marginTop={5}>
      <MdSms size={100} color="#0891b2" />

      <CodeDescriptionsContainer>
        <Heading>Введите код из СМС</Heading>
        <Text>Мы отправили Вам код подтверждения на Ваш номер телефона.</Text>
      </CodeDescriptionsContainer>

      <PinInput.RootProvider value={pinInput}>
        <PinInput.Control>
          {Array.from({ length: 6 }).map((_, index) => (
            <PinInput.Input key={index} index={index} />
          ))}
        </PinInput.Control>
      </PinInput.RootProvider>

      <Button variant="ghost" disabled={!!time} onClick={handleResendCode}>
        Отправить код еще раз {!time ? null : `(${time})`}
      </Button>
    </Stack>
  );
}