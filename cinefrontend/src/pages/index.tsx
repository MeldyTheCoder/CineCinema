import {
  Container,
  Flex,
  Stack,
  createListCollection,
  useBreakpointValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import { announces } from "../test";
import { AnnounceCard } from "../components/announce-card";
import { FilmsList } from "../components/films/films-list";
import { TFilm, TGenre } from "../types";
import { useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { useEffect, useMemo } from "react";
import { filterByUnique, stringToColor } from "../utils/arrays";
import { $films, loadFilmsEv } from "../effector/films.store";
import Slider from "react-slick";
import { styled } from "styled-components";

export const StyledSlider = styled(Slider)`
  width: 100%;

  .slick-track {
    height: 360px;
  }

  .slick-slide {
    padding-left: 10px;
    padding-right: 10px;
    height: auto;
    /* transition: scale 0.3s;
    scale: 0.9; */
  }

  .slick-slide.slick-current {
    /* transition: scale 0.3s;
    scale: 1.05; */
  }

  .slick-dots > li > button::before {
    color: gray !important;
    font-size: 8px;
  }

  .slick-dots > li.slick-active > button::before {
    color: white !important;
  }

  @media screen and (max-width: 500px) {
    .slick-track {
      height: 200px;
    }
  }
`;

function AnouncesSlider() {
  const breakPoint = useBreakpointValue({
    base: "base",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    "2xl": "2xl",
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: ["sm", "md", "base"].includes(breakPoint!) ? 1 : 3,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    centerMode: true,
  };

  return (
    <StyledSlider {...settings}>
      {announces.map((announce) => (
        <AnnounceCard announce={announce} />
      ))}
    </StyledSlider>
  );
}
export function Index() {
  const [films, loadFilms] = useUnit([$films, loadFilmsEv]);
  const navigate = useNavigate();

  const handleFilmClick = (film: TFilm) => {
    navigate(`/film/${film.id}`);
  };

  const genres = useMemo<TGenre[]>(() => {
    console.log(films[0]);

    return filterByUnique<TGenre>(
      films.map((film) => (film?.genres! || []).map((genre) => genre!)).flat(),
      (genre: TGenre) => genre?.id
    );
  }, [films]);

  const genresCollection = useMemo(
    () =>
      createListCollection<TGenre>({
        items: genres,
        itemToString: (item) => item.title,
        itemToValue: (item) => `${item.id}`,
      }),
    [genres]
  );

  useEffect(() => {
    loadFilms();
    console.log(films);
  }, []);

  return (
    <>
      <Header />
      <Stack gap={10}>
        <Container alignItems="center" fluid>
          <AnouncesSlider />
        </Container>
        <Container justifyContent="center">
          <Stack direction="column" gap={10}>
            <FilmsList films={films} onFilmClick={handleFilmClick} />
          </Stack>
        </Container>
      </Stack>
    </>
  );
}
