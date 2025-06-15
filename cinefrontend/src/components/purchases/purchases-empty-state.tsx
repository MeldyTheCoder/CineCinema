import { Card, EmptyState, VStack } from "@chakra-ui/react";
import { LuShoppingCart } from "react-icons/lu";

export function PurchasesEmptyState() {
  return (
    <Card.Root width="100%" height="100%">
      <Card.Body>
        <EmptyState.Root>
          <EmptyState.Content>
            <EmptyState.Indicator>
              <LuShoppingCart />
            </EmptyState.Indicator>
            <VStack textAlign="center">
              <EmptyState.Title>У Вас еще не было покупок</EmptyState.Title>
              <EmptyState.Description>
                Выберите фильм по душе и бегом покупать попкорн :)
              </EmptyState.Description>
            </VStack>
          </EmptyState.Content>
        </EmptyState.Root>
      </Card.Body>
    </Card.Root>
  );
}