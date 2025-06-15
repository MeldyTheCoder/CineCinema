import {
  Center,
  Container,
  Spinner,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Header } from "../components/header";
import { AnnounceCard } from "../components/announce-card";
import { FilmsList } from "../components/films";
import { TAnnounce, TFilm } from "../types";
import { useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { useEffect } from "react";
import {
  $announcements,
  $announcementsLoading,
  $films,
  loadAnnouncementsEv,
  loadFilmsEv,
} from "../effector/films.store";
import Slider from "react-slick";
import { styled } from "styled-components";
import { Footer } from "../components/footer";

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
  const navigate = useNavigate();
  const [anouncements, loading] = useUnit([
    $announcements,
    $announcementsLoading,
  ]);

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

  useEffect(() => {
    loadAnnouncementsEv();
  }, []);

  const handleAnnounceClick = (announce: TAnnounce) => {
    if (announce.film?.id) {
      navigate(`/film/${announce.film.id}/`);
    }
  }
  
  if (loading) {
    return (
      <Center width="100%">
        <Spinner />
      </Center>
    );
  }

  return (
    <StyledSlider {...settings}>
      {anouncements.map((announce) => (
        <AnnounceCard announce={announce} onClick={handleAnnounceClick} />
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

  useEffect(() => {
    loadFilms();
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
      <Footer />
    </>
  );
}
