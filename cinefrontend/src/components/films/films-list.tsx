import { TFilm } from "../../types";
import { SimpleGrid } from "@chakra-ui/react";
import { FilmCard } from "./film-card";

type FilmsListProps = {
  readonly films: TFilm[];
  readonly onFilmClick?: (_: TFilm) => void;
};

export function FilmsList({ films, onFilmClick }: FilmsListProps) {
  return (
    <SimpleGrid columns={{ lg: 4, md: 3, base: 2 }} gap={{ base: 2, lg: 10 }}>
      {films.map((film) => (
        <FilmCard film={film} onClick={() => onFilmClick?.(film)} />
      ))}
    </SimpleGrid>
  );
}
