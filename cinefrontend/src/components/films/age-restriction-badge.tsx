import { Badge } from "@chakra-ui/react";
import { TAgeRestiction } from "../../types";
import { useColorModeValue } from "../ui/color-mode";

type AgeRestrictionBadgeProps = {
  readonly ageRestriction: TAgeRestiction;
};

export function AgeRestrictionBadge({
  ageRestriction,
}: AgeRestrictionBadgeProps) {
  const badgeBg = useColorModeValue('gray.200', 'gray.800');

  return (
    <Badge background={badgeBg} borderRadius="lg">
      {ageRestriction}+
    </Badge>
  );
}
