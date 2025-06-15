import { Badge, BadgeProps, Wrap } from "@chakra-ui/react";
import { TGenre } from "../../types";
import { cssHslToHex, darkenHexColor, lightenHexColor, stringToColor } from "../../utils/colors";
import { useColorMode, useColorModeValue } from "../ui/color-mode";

type GenresTagsProps = {
  readonly genres: TGenre[];
  readonly onGenreClick?: (_: TGenre) => void;
};

export function GenresTags({ genres, onGenreClick }: GenresTagsProps) {
  const {colorMode} = useColorMode();

  const getPropsForBadge = (genre: TGenre) => {
    const color = stringToColor(genre.title);
    const lightenColor = lightenHexColor(cssHslToHex(color), 60);
    const darkenColor = darkenHexColor(cssHslToHex(color), 60);

    switch (colorMode) {
      case 'dark':
        return {
          color: color,
          backgroundColor: "gray.800"
        } as BadgeProps
      case 'light':
        return {
          backgroundColor: lightenColor,
          color: darkenColor,
        } as BadgeProps
    }
  }

  return (
    <Wrap>
      {genres.map((genre) => (
        <Badge
          {...getPropsForBadge(genre)}
          onClick={() => onGenreClick?.(genre)}
        >
          {genre.title}
        </Badge>
      ))}
    </Wrap>
  );
}
