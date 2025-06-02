import { useState, useMemo } from "react";
import { FaCoins } from "react-icons/fa6";
import { BsCash } from "react-icons/bs";
import { RiBankCardFill } from "react-icons/ri";
import {
  Center,
  HStack,
  Icon,
  RadioCard,
  Separator,
} from "@chakra-ui/react";
import { CashPayment } from "./cash-payment";
import { BonusesPayment } from "./bonuses-payment";
import { CreditCardForm } from "./credit-card-payment";

type PaymentStageProps = {
  readonly totalPrice: number;
  readonly onComplete: (_: any) => void;
  readonly onBack: () => void;
};

type TPaymentMethodsRadioSelectValue = "bonuses" | "cash" | "card" | null;

type PaymentMethodsRadioSelectProps = {
  readonly value?: TPaymentMethodsRadioSelectValue;
  readonly onChange: (_: TPaymentMethodsRadioSelectValue) => void;
};

const PAYMENT_RADIO_ITEMS = [
  { value: "bonuses", title: "Бонусы", icon: <FaCoins /> },
  { value: "cash", title: "Наличные", icon: <BsCash /> },
  { value: "card", title: "Карта", icon: <RiBankCardFill /> },
];

function PaymentMethodsRadioSelect({
  value,
  onChange,
}: PaymentMethodsRadioSelectProps) {
  return (
    <RadioCard.Root
      orientation="vertical"
      align="center"
      maxW={{base: "100%", md: "400px"}}
      defaultValue="card"
      variant="subtle"
      value={value}
      onValueChange={({ value }) =>
        onChange(value as TPaymentMethodsRadioSelectValue)
      }
    >
      <HStack>
        {PAYMENT_RADIO_ITEMS.map((item) => (
          <RadioCard.Item key={item.value} value={item.value} width="10rem">
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <Icon fontSize="2xl" color="fg.muted">
                {item.icon}
              </Icon>
              <RadioCard.ItemText>{item.title}</RadioCard.ItemText>
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </HStack>
    </RadioCard.Root>
  );
}

export function PaymentStage({
  totalPrice,
  onComplete,
}: PaymentStageProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<TPaymentMethodsRadioSelectValue>("card");

  const currentForm = useMemo<React.ReactNode>(() => {
    switch (paymentMethod) {
        case 'card':
            return <CreditCardForm totalPrice={totalPrice} onSubmit={(data) => onComplete({...data, paymentMethod})} />;
        case 'cash':
            return <CashPayment totalPrice={totalPrice} onSubmit={() => onComplete({paymentMethod})} />;
        case "bonuses":
            return <BonusesPayment totalPrice={totalPrice} onSubmit={() => onComplete({paymentMethod})} />;
        default:
            return null;
    }
  }, [paymentMethod]);

  return (
    <>
      <Center>
        <PaymentMethodsRadioSelect
          value={paymentMethod}
          onChange={(value) => setPaymentMethod(value)}
        />
      </Center>

      <Separator marginY="1rem" width={{base: "100%", md: "60%"}} justifySelf="center" />
      <Center>
        {currentForm}
      </Center>
    </>
  );
}
