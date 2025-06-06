import { TFilm } from "../../types";
import { Card, Image, Stack, Badge, Wrap, SimpleGrid } from "@chakra-ui/react";
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
    <Card.Root
      _hover={{ bg: "gray.900", scale: 1.02 }}
      transition="background-color 0.3s, scale 0.3s"
      onClick={onClick!}
      size={{ base: "sm", lg: "lg" }}
    >
      <Image
        src={film.coverUrl}
        aspectRatio="1x2"
        objectFit="cover"
        width="inherit"
        height={{ lg: 450, base: "250px" }}
      />
      <Card.Body>
        <Stack gap={2}>
          <Wrap gap={3}>
            <Card.Title>{film.title}</Card.Title>
          </Wrap>

          <Wrap gap={{ lg: 2, base: "7px" }}>
            {film.genres?.length > 0 && <GenresTags genres={film.genres!} />}

            <Badge background="gray.800" borderRadius="lg">
              {film.ageRestriction}+
            </Badge>
          </Wrap>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export function FilmsList({ films, onFilmClick }: FilmsListProps) {
  return (
    <SimpleGrid columns={{ lg: 4, md: 3, base: 2 }} gap={{ base: 2, lg: 10 }}>
      {films.map((film) => (
        <FilmCard film={film} onClick={() => onFilmClick?.(film)} />
      ))}
    </SimpleGrid>
  );
}
