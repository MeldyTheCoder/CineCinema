import { Badge, Wrap } from "@chakra-ui/react";
import { TGenre } from "../../types";
import { stringToColor } from "../../utils/arrays";

type GenresTagsProps = {
  readonly genres: TGenre[];
  readonly onGenreClick?: (_: TGenre) => void;
};

export function GenresTags({genres, onGenreClick}: GenresTagsProps) {
  return (
    <Wrap>
      {genres.map((genre) => (
        <Badge color={stringToColor(genre.title)} backgroundColor="gray.800" onClick={() => onGenreClick?.(genre)}>{genre.title}</Badge>
      ))}
    </Wrap>
  );
}
