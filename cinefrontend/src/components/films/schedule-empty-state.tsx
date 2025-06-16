import { Center, EmptyState, VStack } from "@chakra-ui/react";
import { MdSchedule } from "react-icons/md";

export function ScheduleEmptyState() {
  return (
    <Center>
      <EmptyState.Root width="auto" padding={0}>
        <EmptyState.Content>
          <EmptyState.Indicator>
            <MdSchedule />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Ближайшие сеансы не найдены.</EmptyState.Title>
            <EmptyState.Description>
              К сожалению, в данный момент ближайшие сеансы отсутсвуют.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Center>
  );
}