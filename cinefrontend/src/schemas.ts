import { z } from "zod";
import { TAgeRestiction, TSeatType, BonusLogTypes, OrderStatuses  } from "./types";

// Enums
export const AgeRestictionSchema = z.nativeEnum(TAgeRestiction);
export const SeatTypeSchema = z.nativeEnum(TSeatType);
export const BonusLogTypesSchema = z.nativeEnum(BonusLogTypes);
export const OrderStatusesSchema = z.nativeEnum(OrderStatuses);

// Basic types
export const GenreSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export const RegionSchema = z.object({
  id: z.number(),
  title: z.string(),
  longitude: z.number(),
  latitude: z.number(),
});

export const OfficeSchema = z.object({
  id: z.number(),
  region: RegionSchema,
  address: z.string(),
  longitude: z.string(),
  latitude: z.string(),
  active: z.boolean(),
});

export const HallSchema = z.object({
  id: z.number(),
  title: z.string(),
  priceFactor: z.number(),
  seatsX: z.number(),
  seatsY: z.number(),
  office: OfficeSchema,
});

export const SeatSchema = z.object({
  id: z.number(),
  row: z.number(),
  column: z.number(),
  hall: HallSchema,
  priceFactor: z.number(),
  type: SeatTypeSchema,
});

export const FilmSchema = z.object({
  title: z.string(),
  description: z.string(),
  rating: z.number(),
  id: z.number(),
  genres: z.array(GenreSchema),
  ageRestriction: AgeRestictionSchema,
  durationSeconds: z.number(),
  coverUrl: z.string(),
  price: z.number(),
  activeDateFrom: z.string(),
  activeDateTo: z.string(),
});

export const ActorSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  photoUrl: z.string(),
});

export const FilmActorSchema = z.object({
  id: z.number(),
  actor: ActorSchema,
  role: z.string(),
  film: FilmSchema,
});

export const FilmAttachmentSchema = z.object({
  id: z.number(),
  film: FilmSchema,
  attachmentUrl: z.string(),
  mimeType: z.enum(["video", "photo"]),
});

export const ScheduleSchema = z.object({
  id: z.number(),
  hall: HallSchema,
  time: z.number(),
  film: FilmSchema,
  dayId: z.number(),
  year: z.number(),
});

export const UserSchema = z.object({
  firstName: z.string(),
  lastName: z.string().nullable(),
  id: z.number(),
  phone: z.string(),
  email: z.string().nullable(),
  avatar: z.string(),
});

export const OrderSchema = z.object({
  id: z.number(),
  schedule: ScheduleSchema,
  seat: SeatSchema,
  dateCreated: z.string(),
  totalPrice: z.number(),
  user: UserSchema,
  film: FilmSchema,
  status: z.union([z.string(), OrderStatusesSchema]),
  price: z.number(),
});

export const AnnounceSchema = z.object({
  id: z.number(),
  coverUrl: z.string(),
  title: z.string(),
  text: z.string(),
  dateCloses: z.string(),
  dateCreated: z.string(),
  film: FilmSchema,
});

export const BonusLogSchema = z.object({
  id: z.number(),
  film: FilmSchema,
  bonuses: z.number(),
  type: z.union([z.string(), BonusLogTypesSchema]),
  user: UserSchema,
});

export const LevelInfoSchema = z.object({
  level: z.number(),
  currentXp: z.number(),
  nextLevelXp: z.number(),
  progress: z.number(),
});

export const BonusResponseSchema = z.object({
  levelInfo: LevelInfoSchema,
  logs: z.array(BonusLogSchema),
  currentBonuses: z.number(),
});