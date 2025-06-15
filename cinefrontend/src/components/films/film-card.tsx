import { Card, Image, Stack, Wrap } from "@chakra-ui/react";
import { TFilm } from "../../types";
import { useColorModeValue } from "../ui/color-mode";
import { parseUrl } from "../../utils/urls";
import { GenresTags } from "./genres-tags";
import { AgeRestrictionBadge } from "./age-restriction-badge";

type FilmCardProps = {
  readonly film: TFilm;
  readonly onClick?: () => void;
};

export function FilmCard({ film, onClick }: FilmCardProps) {
  const cardHoverBg = useColorModeValue("gray.100", "gray.900");

  return (
    <Card.Root
      _hover={{ bg: cardHoverBg, scale: 1.02 }}
      transition="background-color 0.3s, scale 0.3s"
      onClick={onClick!}
      size={{ base: "sm", lg: "lg" }}
    >
      <Image
        src={parseUrl(film.coverUrl)}
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

            <AgeRestrictionBadge ageRestriction={film.ageRestriction!} />
          </Wrap>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
