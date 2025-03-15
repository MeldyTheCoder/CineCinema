export type TUser = {
    first_name: string;
    last_name: string;
    password: string;
    id: number;
    phone: string;
}

export enum TAgeRestiction {
    ZERO_PLUS = 0,
    SIX_PLUS = 6,
    TWELVE_PLUS = 12,
    SIXTEEN_PLUS = 16,
    EIGHTEEN_PLUS = 18,
}

export enum TSeatType {
    STANDART = 'standart',
    VIP = 'vip',
    DISABLED = 'disabled',
}

export type TGenre = {
    id: number;
    title: string;
}

export type TFilm = {
    title: string;
    description: string;
    rating: number;
    id: number;
    genres: TGenre[];
    age_restriction: TAgeRestiction;
    duration_seconds: number;
    cover_url: string;
    price: number;
    active_date_from: string;
    active_date_to: string;
}

export type TActor = {
    id: number;
    first_name: string;
    last_name: string;
    photo_url: string;
}

export type TFilmActor = {
    id: number;
    actor: TActor;
    role: string;
    film: TFilm;
}

export type TFilmAttachment = {
    id: number;
    film: TFilm;
    attachment_url: string;
    mime_type: 'video' | 'photo';
}

export type THall = {
    id: number;
    title: string;
    price_factor: number;
    seats_x: number;
    seats_y: number;
}

export type TSeat = {
    id: number;
    row: number;
    seat_id: number;
    hall: THall;
    price_factor: number;
    type: TSeatType;
}

export type TSchedule = {
    id: number;
    hall: THall;
    time: number;
    film: TFilm;
    day_id: number;
    year: number;
}

export type TOrder = {
    id: number;
    schedule: TSchedule;
    seat: TSeat;
    date_created: string;
    total_price: number;
    user: TUser;
}

export type TAnnounce = {
    id: number;
    cover_url: string;
    title: string;
    text: string;
    date_closes: string;
    date_created: string;
    film: TFilm;
}

export type TRegion = {
    id: number;
    title: string;
    longitude: number;
    latitude: number;
}

export type TOffice = {
    id: number;
    region: TRegion;
    address: string;
    longitude: number;
    latitude: number;
    active: boolean;
}