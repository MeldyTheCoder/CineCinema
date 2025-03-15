import { TFilm } from "../types";
import { Card, Image, Button, Stack, Badge, Wrap, Grid, SimpleGrid } from "@chakra-ui/react";
import { GenresTags } from "./genres-tags";

type FilmsListProps = {
  readonly films: TFilm[];
  readonly onFilmClick?: (_: TFilm) => void;
};

type FilmCardProps = {
  readonly film: TFilm;
  readonly onClick?: () => void;
};

export function FilmCard({ film, onClick }: FilmCardProps) {
  return (
    <Card.Root _hover={{ bg: "gray.900", scale: 1.02 }} transition="background-color 0.3s, scale 0.3s" onClick={onClick!}>
      <Image
        src={film.cover_url}
        aspectRatio="1x2"
        objectFit="cover"
        width="inherit"
        height={{lg: 470, base: 'auto'}}
      />
      <Card.Body>
        <Stack gap={2}>
          <Wrap gap={3}>
            <Card.Title>{film.title}</Card.Title>
          </Wrap>

          <Stack gap={2} direction="row">
            {film.genres?.length > 0 && <GenresTags genres={film.genres!} />}

            <Badge background="gray.800" borderRadius="lg">{film.age_restriction}+</Badge>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export function FilmsList({ films, onFilmClick }: FilmsListProps) {
  return (
    <SimpleGrid columns={{lg: 4, md: 3, base: 1}} gap={10}>
      {films.map((film) => (
        <FilmCard film={film} onClick={() => onFilmClick?.(film)}/>
      ))}
    </SimpleGrid>
  );
}
