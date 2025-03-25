import React, { useState } from "react";
import { Badge, Wrap } from "@chakra-ui/react";

export type RadioBadgesProps<T> = {
  readonly value?: T;
  readonly elements: T[];
  readonly itemRenderer: (_: T) => string | number;
  readonly onSelect: (_: T) => void;
  readonly colorPalette?: string;
};

export function RadioBadges<T>({
  elements,
  onSelect,
  itemRenderer,
}: RadioBadgesProps<T>) {
  const [selectedElement, setSelectedElement] = useState<T>();

  const handleChangeValue = (element: T): void => {
    setSelectedElement(() => element);
    onSelect?.(element);
  };

  const checkIfSelected = (element: T): boolean => {
    return JSON.stringify(element) === JSON.stringify(selectedElement!);
  };

  return (
    <Wrap gap={2}>
      {elements.map((element: T) => (
        <Badge
          size="lg"
          variant="subtle"
          onClick={() => handleChangeValue(element)}
          transition="background: 0.3s"
          bg={checkIfSelected(element) ? "gray.700" : "gray.900"}
        >
          {itemRenderer(element)}
        </Badge>
      ))}
    </Wrap>
  );
}
