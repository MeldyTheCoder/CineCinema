import { dayjs } from "./utils/dates";
import { TAgeRestiction, TFilm, TAnnounce } from "./types";

const genres = [
  { id: 1, title: "Аниме" },
  { id: 2, title: "Биографический" },
  { id: 3, title: "Боевик" },
  { id: 4, title: "Вестерн" },
  { id: 5, title: "Военный" },
  { id: 6, title: "Детектив" },
  { id: 7, title: "Детский" },
  { id: 8, title: "Документальный" },
  { id: 9, title: "Драма" },
  { id: 10, title: "Исторический" },
  { id: 11, title: "Кинокомикс" },
  { id: 12, title: "Комедия" },
  { id: 13, title: "Концерт" },
  { id: 14, title: "Короткометражный" },
  { id: 15, title: "Криминал" },
  { id: 16, title: "Мелодрама" },
  { id: 17, title: "Мистика" },
  { id: 18, title: "Музыка" },
  { id: 19, title: "Мультфильм" },
  { id: 20, title: "Мюзикл" },
  { id: 21, title: "Научный" },
  { id: 22, title: "Нуар" },
  { id: 23, title: "Приключения" },
  { id: 24, title: "Реалити-шоу" },
  { id: 25, title: "Семейный" },
  { id: 26, title: "Спорт" },
  { id: 27, title: "Ток-шоу" },
  { id: 28, title: "Триллер" },
  { id: 29, title: "Ужасы" },
  { id: 30, title: "Фантастика" },
  { id: 31, title: "Фэнтези" },
  { id: 32, title: "Эротика" },
];

const films: TFilm[] = [
  {
    id: 1,
    title: "Назад в будущее",
    description:
      "Подросток случайно попадает в прошлое и должен исправить ход истории, чтобы не исчезнуть.",
    rating: 8.5,
    genres: [
      genres.find((g) => g.title === "Фэнтези")!,
      genres.find((g) => g.id === 1)!,
    ], // Фантастика
    ageRestriction: TAgeRestiction.TWELVE_PLUS,
    durationSeconds: 6960, // 1 час 56 минут
    coverUrl: "https://upload.wikimedia.org/wikipedia/ru/9/90/BTTF_DVD_rus.jpg",
    price: 350,
    activeDateFrom: "2025-03-05",
    activeDateTo: "2025-04-01",
    director: "Режиссер НоуНейм",
  },
  {
    id: 2,
    title: "Джон Уик",
    description:
      "Бывший наёмный убийца возвращается в мир криминала после потери самого дорогого.",
    rating: 7.9,
    genres: [genres.find((g) => g.title === "Боевик")!], // Боевик
    ageRestriction: TAgeRestiction.EIGHTEEN_PLUS,
    durationSeconds: 6060, // 1 час 41 минута
    coverUrl:
      "https://upload.wikimedia.org/wikipedia/ru/thumb/e/e5/%D0%94%D0%B6%D0%BE%D0%BD_%D0%A3%D0%B8%D0%BA.jpg/800px-%D0%94%D0%B6%D0%BE%D0%BD_%D0%A3%D0%B8%D0%BA.jpg",
    price: 400,
    activeDateFrom: "2025-03-10",
    activeDateTo: "2025-04-15",
    director: "Режиссер НоуНейм",
  },
];

const announces: TAnnounce[] = [
  {
    id: 1,
    coverUrl:
      "https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/16221040/parabellumcover.jpg?quality=90&strip=all&crop=7.8362408553742,0,84.327518289252,100",
    title: "Джон Уик",
    text: "Узнай какого это, когда тебя хуярят обрезом и отрубают палец",
    dateCreated: dayjs().format("DD.MM.YYYY"),
    dateCloses: dayjs().format("DD.MM.YYYY"),
    film: films[0],
  },
  {
    id: 2,
    coverUrl:
      "https://wallpapers.com/images/hd/1920x1080-hd-movie-1920-x-1080-gz4tb89aora60d2b.jpg",
    title: "Хобби и Ты",
    text: "Говно какое-то, не не слышали",
    dateCreated: dayjs().format("DD.MM.YYYY"),
    dateCloses: dayjs().format("DD.MM.YYYY"),
    film: films[0],
  },
  {
    id: 3,
    coverUrl: "https://wallpapercave.com/wp/wp8525542.jpg",
    title: "Ну нихуя себе",
    text: "Вот это пиздец конечно полный.",
    dateCreated: dayjs().format("DD.MM.YYYY"),
    dateCloses: dayjs().format("DD.MM.YYYY"),
    film: films[0],
  },
];

export {
  films,
  announces,
  genres,
};
