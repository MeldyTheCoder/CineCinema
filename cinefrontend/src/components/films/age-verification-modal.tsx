import { Dialog, Portal, Button, useDialog, useEditable } from "@chakra-ui/react";
import { useUnit } from "effector-react";
import React, { useEffect } from "react";
import { $isAdult, setIsAdultEv } from "../../effector/age.store";
import { TFilm } from "../../types";

type AgeVerifictionModal = {
  readonly film: TFilm;
};

export function AgeVerificationModal({film}: AgeVerifictionModal) {
  const [isAdult, setIsAdult] = useUnit([$isAdult, setIsAdultEv]);

  const dialog = useDialog({
    role: "alertdialog",
  });

  const handleAccept = () => {
    dialog.setOpen(false);
    setIsAdult(true);
  };

  const handleDeny = () => {
    window.history.back();
    dialog.setOpen(false);
  };

  useEffect(() => {
    if (!isAdult && film.ageRestriction >= 18) {
        dialog.setOpen(true);
        return;
    }
  }, [isAdult])

  return (
    <Dialog.RootProvider value={dialog} placement="center">
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 0, 0.95)" backdropBlur="blur(1.5rem)" />
        <Dialog.Positioner>
          <Dialog.Content borderRadius="20px">
            <Dialog.Header textAlign="center" justifyContent="center">
              <Dialog.Title fontSize="30px">Вам есть 18 лет?</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body justifyContent="center" textAlign="center">
              <p>
                Данный фильм имеет возрастное ограничение 18+ в связи с
                содержанием сцен с ярко выраженными элементами
                насилия/психологического напряжения/ненормативной лексики и
                прочего.
              </p>
            </Dialog.Body>
            <Dialog.Footer justifyContent="center" textAlign="center">
              <Dialog.ActionTrigger asChild>
                <Button variant="outline" onClick={handleDeny}>
                  Нет
                </Button>
              </Dialog.ActionTrigger>
              <Button
                colorPalette="purple"
                variant="subtle"
                onClick={handleAccept}
              >
                Да, мне есть 18
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
