import React, { useState } from "react";
import { Badge, Wrap } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";

export type RadioBadgesProps<T> = {
  readonly value?: T;
  readonly elements: T[];
  readonly itemRenderer: (_: T) => string | number;
  readonly onSelect: (_: T) => void;
  readonly colorPalette?: string;
};

export function RadioBadges<T>({
  value,
  elements,
  onSelect,
  itemRenderer,
}: RadioBadgesProps<T>) {
  const badgeBg = useColorModeValue('gray.100', 'gray.700');
  const badgeSelectedBg = useColorModeValue('gray.300', 'gray.900');

  const handleChangeValue = (element: T): void => {
    onSelect?.(element);
  };

  const checkIfSelected = (element: T): boolean => {
    return element == value!;
  };

  return (
    <Wrap gap={2}>
      {elements.map((element: T) => (
        <Badge
          size="lg"
          variant="subtle"
          onClick={() => handleChangeValue(element)}
          transition="background: 0.3s"
          bg={checkIfSelected(element) ? badgeSelectedBg : badgeBg}
        >
          {itemRenderer(element)}
        </Badge>
      ))}
    </Wrap>
  );
}
