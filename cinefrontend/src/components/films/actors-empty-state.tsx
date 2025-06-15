import { EmptyState, VStack } from "@chakra-ui/react";
import { MdOutlinePersonOutline } from "react-icons/md";

export function ActorsListEmptyState() {
  return (
    <EmptyState.Root>
      <EmptyState.Content>
        <EmptyState.Indicator>
          <MdOutlinePersonOutline />
        </EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>Актеры не найдены.</EmptyState.Title>
          <EmptyState.Description>
            Вероятнее всего актеров данного фильма не удалось найти.
          </EmptyState.Description>
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}