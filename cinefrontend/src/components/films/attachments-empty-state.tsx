import { Center, EmptyState, VStack } from "@chakra-ui/react";
import { MdOutlinePermMedia } from "react-icons/md";

export function AttachmentsEmptyState() {
  return (
    <Center>
      <EmptyState.Root width="auto">
        <EmptyState.Content>
          <EmptyState.Indicator>
            <MdOutlinePermMedia />
          </EmptyState.Indicator>
          <VStack textAlign="center">
            <EmptyState.Title>Медиа-файлы не были найдены</EmptyState.Title>
            <EmptyState.Description>
              К сожалению, в данный момент раздел галереи для данного фильма недоступен.
            </EmptyState.Description>
          </VStack>
        </EmptyState.Content>
      </EmptyState.Root>
    </Center>
  );
}