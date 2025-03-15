import {dayjs} from "./utils/dates";
import {
  TAgeRestiction,
  TFilm,
  TFilmAttachment,
  THall,
  TOrder,
  TSchedule,
  TSeat,
  TSeatType,
  TUser,
  TActor,
  TAnnounce,
} from "./types";

const users: TUser[] = [
  {
    id: 1,
    first_name: "Кирилл",
    last_name: "Грошелев",
    password: "1234",
    phone: "79997802412",
  },
];

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
    genres: [genres.find((g) => g.title === "Фэнтези")!, genres.find((g) => g.id === 1)!], // Фантастика
    age_restriction: TAgeRestiction.TWELVE_PLUS,
    duration_seconds: 6960, // 1 час 56 минут
    cover_url: "https://upload.wikimedia.org/wikipedia/ru/9/90/BTTF_DVD_rus.jpg",
    price: 350,
    active_date_from: "2025-03-05",
    active_date_to: "2025-04-01",
  },
  {
    id: 2,
    title: "Джон Уик",
    description:
      "Бывший наёмный убийца возвращается в мир криминала после потери самого дорогого.",
    rating: 7.9,
    genres: [genres.find((g) => g.title === "Боевик")!], // Боевик
    age_restriction: TAgeRestiction.EIGHTEEN_PLUS,
    duration_seconds: 6060, // 1 час 41 минута
    cover_url:
      "https://upload.wikimedia.org/wikipedia/ru/thumb/e/e5/%D0%94%D0%B6%D0%BE%D0%BD_%D0%A3%D0%B8%D0%BA.jpg/800px-%D0%94%D0%B6%D0%BE%D0%BD_%D0%A3%D0%B8%D0%BA.jpg",
    price: 400,
    active_date_from: "2025-03-10",
    active_date_to: "2025-04-15",
  },
  {
    id: 3,
    title: "Крик 6",
    description:
      "Группа подростков становится мишенью загадочного убийцы в маске.",
    rating: 7.2,
    genres: [genres.find((g) => g.title === "Ужасы")!], // Ужасы
    age_restriction: TAgeRestiction.SIXTEEN_PLUS,
    duration_seconds: 6600, // 1 час 50 минут
    cover_url:
      "https://upload.wikimedia.org/wikipedia/ru/thumb/6/6a/%D0%9A%D1%80%D0%B8%D0%BA_%282023%29.jpg/640px-%D0%9A%D1%80%D0%B8%D0%BA_%282023%29.jpg",
    price: 370,
    active_date_from: "2025-03-08",
    active_date_to: "2025-04-05",
  },
  {
    id: 4,
    title: "Мистер Бин",
    description:
      "Забавные приключения неуклюжего англичанина в разных ситуациях.",
    rating: 8.0,
    genres: [genres.find((g) => g.title === "Комедия")!], // Комедия
    age_restriction: TAgeRestiction.ZERO_PLUS,
    duration_seconds: 5400, // 1 час 30 минут
    cover_url:
      "https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/07126f53-52e5-4feb-ac07-05167cfee824/600x900",
    price: 300,
    active_date_from: "2025-03-12",
    active_date_to: "2025-04-20",
  },
  {
    id: 5,
    title: "Начало",
    description:
      "Группа специалистов по внедрению идей в сознание людей отправляется в путешествие по снам.",
    rating: 8.8,
    genres: [genres.find((g) => g.title === "Фэнтези")!], // Фантастика
    age_restriction: TAgeRestiction.SIXTEEN_PLUS,
    duration_seconds: 8880, // 2 часа 28 минут
    cover_url:
      "https://optim.tildacdn.com/tild6262-6638-4137-b861-363463343431/-/format/webp/MV5BMjExMjkwNTQ0Nl5B.jpg",
    price: 450,
    active_date_from: "2025-03-15",
    active_date_to: "2025-04-25",
  },
];

const filmAttachments: TFilmAttachment[] = [];

const halls: THall[] = [
  {
    id: 1,
    title: "IMAX Galaxy",
    price_factor: 1.5, // Повышенная цена за премиальный формат,
    seats_x: 10,
    seats_y: 5,
  },
  {
    id: 2,
    title: "Люкс КиноЛаунж",
    price_factor: 2.0, // VIP-зал с удобными креслами и обслуживанием,
    seats_x: 5,
    seats_y: 10,
  },
  {
    id: 3,
    title: "Классический Экран",
    price_factor: 1.0, // Обычный зал без доплат
    seats_x: 5,
    seats_y: 20,
  },
];

const actors: TActor[] = [
  {
    id: 1,
    first_name: "Киану",
    last_name: "Ривз",
    photo_url:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QFhRXhpZgAASUkqAAgAAAADAA4BAgAWAQAAMgAAAJiCAgARAAAASAEAABIBAwABAAAAAQAAAAAAAABDQU5ORVMsIEZSQU5DRSAtIE1BWSAxNTogIEFjdG9yIEtlYW51IFJlZXZlcyBwb3NlcyBmb3IgdGhlIGNhbWVyYXMgZHVyaW5nIGEgcGhvdG9jYWxsIGZvciB0aGUgZmlsbSAiVGhlIE1hdHJpeCBSZWxvYWRlZCIgYXQgdGhlIFBhbGFpcyBkZXMgRmVzdGl2YWxzIGR1cmluZyB0aGUgNTZ0aCBJbnRlcm5hdGlvbmFsIENhbm5lcyBGaWxtIEZlc3RpdmFsIG9uIE1heSAxNSwgMjAwMyBpbiBDYW5uZXMsIEZyYW5jZS4gKFBob3RvIGJ5IFBhc2NhbCBMZSBTZWdyZXRhaW4vR2V0dHkgSW1hZ2VzKTIwMDMgR2V0dHkgSW1hZ2Vz/+0BdlBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAFaHAJQABNQYXNjYWwgTGUgU2VncmV0YWluHAJ4ARZDQU5ORVMsIEZSQU5DRSAtIE1BWSAxNTogIEFjdG9yIEtlYW51IFJlZXZlcyBwb3NlcyBmb3IgdGhlIGNhbWVyYXMgZHVyaW5nIGEgcGhvdG9jYWxsIGZvciB0aGUgZmlsbSAiVGhlIE1hdHJpeCBSZWxvYWRlZCIgYXQgdGhlIFBhbGFpcyBkZXMgRmVzdGl2YWxzIGR1cmluZyB0aGUgNTZ0aCBJbnRlcm5hdGlvbmFsIENhbm5lcyBGaWxtIEZlc3RpdmFsIG9uIE1heSAxNSwgMjAwMyBpbiBDYW5uZXMsIEZyYW5jZS4gKFBob3RvIGJ5IFBhc2NhbCBMZSBTZWdyZXRhaW4vR2V0dHkgSW1hZ2VzKRwCdAARMjAwMyBHZXR0eSBJbWFnZXMcAm4ADEdldHR5IEltYWdlc//hBjpodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPgoJPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KCQk8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOklwdGM0eG1wQ29yZT0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcENvcmUvMS4wL3htbG5zLyIgICB4bWxuczpHZXR0eUltYWdlc0dJRlQ9Imh0dHA6Ly94bXAuZ2V0dHlpbWFnZXMuY29tL2dpZnQvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwbHVzPSJodHRwOi8vbnMudXNlcGx1cy5vcmcvbGRmL3htcC8xLjAvIiAgeG1sbnM6aXB0Y0V4dD0iaHR0cDovL2lwdGMub3JnL3N0ZC9JcHRjNHhtcEV4dC8yMDA4LTAyLTI5LyIgeG1sbnM6eG1wUmlnaHRzPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvcmlnaHRzLyIgZGM6UmlnaHRzPSIyMDAzIEdldHR5IEltYWdlcyIgcGhvdG9zaG9wOkNyZWRpdD0iR2V0dHkgSW1hZ2VzIiBHZXR0eUltYWdlc0dJRlQ6QXNzZXRJRD0iMjAwMDQxOSIgeG1wUmlnaHRzOldlYlN0YXRlbWVudD0iaHR0cHM6Ly93d3cuZ2V0dHlpbWFnZXMuY29tL2V1bGE/dXRtX21lZGl1bT1vcmdhbmljJmFtcDt1dG1fc291cmNlPWdvb2dsZSZhbXA7dXRtX2NhbXBhaWduPWlwdGN1cmwiID4KPGRjOmNyZWF0b3I+PHJkZjpTZXE+PHJkZjpsaT5QYXNjYWwgTGUgU2VncmV0YWluPC9yZGY6bGk+PC9yZGY6U2VxPjwvZGM6Y3JlYXRvcj48ZGM6ZGVzY3JpcHRpb24+PHJkZjpBbHQ+PHJkZjpsaSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5DQU5ORVMsIEZSQU5DRSAtIE1BWSAxNTogIEFjdG9yIEtlYW51IFJlZXZlcyBwb3NlcyBmb3IgdGhlIGNhbWVyYXMgZHVyaW5nIGEgcGhvdG9j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",
  },
  {
    id: 2,
    first_name: "Иэн",
    last_name: "Макшейн",
    photo_url:
      "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcS4-n41EIq077ZpcEygj28llKm6hfpLuU97MVdQUursbnV3tszHHG3vfWlQeszWXXc3cCj9z4rX&s=19",
  },
];

const seats: TSeat[] = [
  // Ряд 1 (VIP)
  {
    id: 1,
    row: 1,
    seat_id: 1,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 2,
    row: 1,
    seat_id: 2,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 3,
    row: 1,
    seat_id: 3,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 4,
    row: 1,
    seat_id: 4,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 5,
    row: 1,
    seat_id: 5,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 6,
    row: 1,
    seat_id: 6,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 7,
    row: 1,
    seat_id: 7,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 8,
    row: 1,
    seat_id: 8,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 9,
    row: 1,
    seat_id: 9,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },
  {
    id: 10,
    row: 1,
    seat_id: 10,
    hall: halls[0],
    price_factor: 1.5,
    type: TSeatType.VIP,
  },

  // Ряды 2-4 (Стандартные)
  ...Array.from({ length: 3 }, (_, r) =>
    Array.from({ length: 10 }, (_, s) => ({
      id: 10 * (r + 1) + s + 1,
      row: r + 2,
      seat_id: s + 1,
      hall: halls[0],
      price_factor: s < 2 || s > 7 ? 1.2 : 1.0, // Крайние места дороже
      type: TSeatType.STANDART,
    }))
  ).flat(),

  // Ряд 5 (Места для маломобильных)
  {
    id: 41,
    row: 5,
    seat_id: 1,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 42,
    row: 5,
    seat_id: 2,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 43,
    row: 5,
    seat_id: 3,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 44,
    row: 5,
    seat_id: 4,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 45,
    row: 5,
    seat_id: 5,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 46,
    row: 5,
    seat_id: 6,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 47,
    row: 5,
    seat_id: 7,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 48,
    row: 5,
    seat_id: 8,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 49,
    row: 5,
    seat_id: 9,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
  {
    id: 50,
    row: 5,
    seat_id: 10,
    hall: halls[0],
    price_factor: 1.0,
    type: TSeatType.DISABLED,
  },
];

const schedule: TSchedule[] = [
  {
    id: 1,
    hall: halls[0],
    time: 16 * 3600 + 16 * 60,
    film: films[0],
    day_id: 62,
    year: 2025,
  },
  {
    id: 2,
    hall: halls[1],
    time: 0 * 3600 + 20 * 60,
    film: films[1],
    day_id: 61,
    year: 2025,
  },
  {
    id: 2,
    hall: halls[1],
    time: 13 * 3600 + 20 * 60,
    film: films[1],
    day_id: 61,
    year: 2025,
  },
  {
    id: 2,
    hall: halls[1],
    time: 15 * 3600 + 55 * 60,
    film: films[1],
    day_id: 61,
    year: 2025,
  },
  {
    id: 2,
    hall: halls[1],
    time: 20 * 60,
    film: films[1],
    day_id: 61,
    year: 2025,
  },
  {
    id: 2,
    hall: halls[1],
    time: 16 * 60,
    film: films[1],
    dayId: 61,
    year: 2025,
  },
  {
    id: 3,
    hall: halls[0],
    time: 17 * 60,
    film: films[0],
    dayId: 61,
    year: 2025,
  },
  {
    id: 4,
    hall: halls[0],
    time: 1 * 3600 + 17 * 60,
    film: films[0],
    dayId: 62,
    year: 2025,
  },
  {
    id: 5,
    hall: halls[0],
    time: 2 * 3600 + 17 * 60,
    film: films[0],
    dayId: 62,
    year: 2025,
  },
  {
    id: 6,
    hall: halls[0],
    time: 3 * 3600 + 17 * 60,
    film: films[0],
    dayId: 66,
    year: 2025,
  },
  {
    id: 7,
    hall: halls[0],
    time: 4 * 3600 + 17 * 60,
    film: films[0],
    dayId: 68,
    year: 2024,
  },
];

const orders: TOrder[] = [
  {
    id: 1,
    schedule: schedule[0],
    seat: seats[1],
    date_created: dayjs().format('DD.MM.YYYY'),
    total_price: 3000,
    user: users[0],
  },
];

const announces: TAnnounce[] = [
  {
    id: 1,
    cover_url: "https://oboi-download.ru/files/wallpapers/684/19501.jpg",
    title: "Джон Уик",
    text: "Узнай какого это, когда тебя хуярят обрезом и отрубают палец",
  },
  {
    id: 2,
    cover_url:
      "https://wallpapers.com/images/hd/1920x1080-hd-movie-1920-x-1080-gz4tb89aora60d2b.jpg",
    title: "Хобби и Ты",
    text: "Говно какое-то, не не слышали",
  },
  {
    id: 3,
    cover_url: "https://wallpapercave.com/wp/wp8525542.jpg",
    title: "Ну нихуя себе",
    text: "Вот это пиздец конечно полный.",
  },
];

export {
  users,
  films,
  filmAttachments,
  halls,
  seats,
  orders,
  schedule,
  actors,
  announces,
  genres,
};
