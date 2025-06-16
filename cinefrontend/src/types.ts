export type TUser = {
    firstName: string;
    lastName: string | null;
    id: number;
    phone: string;
    email: string | null;
    avatar: string;
    registrationDate: string;
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
    VOID = 'void',
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
    ageRestriction: TAgeRestiction;
    durationSeconds: number;
    coverUrl: string;
    price: number;
    activeDateFrom: string;
    activeDateTo: string;
    director: string;
}

export type TActor = {
    id: number;
    firstName: string;
    lastName: string;
    photoUrl: string;
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
    attachmentUrl: string;
    mimeType: 'video' | 'photo';
}

export type THall = {
    id: number;
    title: string;
    priceFactor: number;
    seatsX: number;
    seatsY: number;
    office: TOffice;
}

export type TSeat = {
    id: number;
    row: number;
    column: number;
    hall: THall;
    priceFactor: number;
    type: TSeatType;
    isAvailable?: boolean;
    verboseName: string;
}

export type TSchedule = {
    id: number;
    hall: THall;
    time: number;
    film: TFilm;
    dayId: number;
    year: number;
}

export type TOrder = {
    id: number;
    schedule: TSchedule;
    seats: TSeat[];
    dateCreated: string;
    totalPrice: number;
    user: TUser;
    film: TFilm;
    status: string | OrderStatuses
    price: number;
}

export type TAnnounce = {
    id: number;
    coverUrl: string;
    title: string;
    text: string;
    dateCloses: string;
    dateCreated: string;
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
    title: string;
}

export enum BonusLogTypes {
    DEPOSIT = 'deposit',
    WITHDRAWAL = 'withdrawal'
}

export type TBonusLog = {
    id: number;
    order: TOrder;
    bonuses: number;
    type: `${BonusLogTypes}` | BonusLogTypes;
    user: TUser;
}

export type TLevelInfo = {
    level: number;
    currentXp: number;
    nextLevelXp: number;
    progress: number;
}

export type TBonusResponse = {
    levelInfo: TLevelInfo;
    logs: TBonusLog[];
    currentBonuses: number;
}

export enum OrderStatuses {
    NOT_PAID = 'not_paid',
    PAID = 'paid',
    COMPLETE = 'complete',
    POSTPONED = 'postponed',
    CANCELED = 'canceled',
    REFUND = 'refund',
}