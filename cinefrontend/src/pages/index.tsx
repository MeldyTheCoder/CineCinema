import { Container, Flex, Stack, createListCollection } from "@chakra-ui/react";
import { Header } from "../components/header";
import { announces } from "../test";
import { AnnounceCard } from "../components/announce-card";
import { FilmsList } from "../components/films-list";
import { TFilm, TGenre } from "../types";
import { useNavigate } from "react-router-dom";
import { useUnit } from "effector-react";
import { useEffect, useMemo } from "react";
import { filterByUnique, stringToColor } from "../utils/arrays";
import { $films, loadFilmsEv } from "../effector/films.store";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../components/ui/select";
import Slider from "react-slick";
import { styled } from "styled-components";

const StyledSlider = styled(Slider)`
  
  .slick-track {
    height: 390px;
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
`;

function AnouncesSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
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
  const [films] = useUnit([$films]);
  const navigate = useNavigate();

  const handleFilmClick = (film: TFilm) => {
    navigate(`/film/${film.id}`);
  };

  const genres = useMemo<TGenre[]>(
    () =>
      filterByUnique<TGenre>(
        films.map((film) => (film.genres || []).map((genre) => genre!)).flat(),
        (genre: TGenre) => genre?.id
      ),
    [films]
  );

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
    loadFilmsEv();
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
            <Stack direction="row" gap={10}>
              <SelectRoot collection={genresCollection} multiple width={350}>
                <SelectTrigger>
                  <SelectValueText placeholder="Выберите жанры" />
                </SelectTrigger>
                <SelectContent>
                  {genresCollection.items.map((genre) => (
                    <SelectItem item={genre} key={genre.id}>
                      {genre.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>

              <SelectRoot collection={genresCollection} multiple width={350}>
                <SelectTrigger>
                  <SelectValueText placeholder="Выберите жанры" />
                </SelectTrigger>
                <SelectContent>
                  {genresCollection.items.map((genre) => (
                    <SelectItem item={genre} key={genre.id}>
                      {genre.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Stack>
            <FilmsList films={films} onFilmClick={handleFilmClick} />
          </Stack>
        </Container>
      </Stack>
    </>
  );
}
