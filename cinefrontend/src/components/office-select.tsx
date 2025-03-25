import { Stack, RadioCard, HStack, Icon } from "@chakra-ui/react";
import { TOffice } from "../types";
import { RadioBadges, RadioBadgesProps } from "./radio-badges";
import { FaBuilding } from "react-icons/fa";
import { OfficesMap } from "./maps/offices-map";

type OfficeSelectProps = Omit<RadioBadgesProps<TOffice>, "itemRenderer">;

export function OfficeSelect({ elements, value, onSelect }: OfficeSelectProps) {
  return (
    <Stack gap={5} direction="column">
      <OfficesMap selectedOffice={value} offices={elements} />
      <RadioCard.Root
        orientation="vertical"
        align="center"
        justify="center"
        maxW="lg"
        defaultValue={`${value?.id}`}
      >
        <HStack align="stretch" wrap="wrap">
          {elements.map((item) => (
            <RadioCard.Item key={item.id} value={`${item.id}`} onClick={() => onSelect?.(item)}>
              <RadioCard.ItemHiddenInput />
              <RadioCard.ItemControl>
                <Icon fontSize="2xl" color="fg.subtle">
                  <FaBuilding />
                </Icon>
                <RadioCard.ItemText>{item.address}</RadioCard.ItemText>
              </RadioCard.ItemControl>
            </RadioCard.Item>
          ))}
        </HStack>
      </RadioCard.Root>
    </Stack>
  );
}
