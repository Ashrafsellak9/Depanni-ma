import type { Prisma } from "@prisma/client";

import { prisma } from "../config/db.js";
import { NotFoundError } from "./errors.js";

export const senderUserSelect = {
  id: true,
  citizen: { select: { firstName: true, lastName: true, avatar: true } },
  artisan: { select: { firstName: true, lastName: true, avatar: true } },
} as const satisfies Prisma.UserSelect;

export type SenderUserRow = Prisma.UserGetPayload<{ select: typeof senderUserSelect }>;

export function mapSenderProfile(user: SenderUserRow): {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
} {
  const profile = user.citizen ?? user.artisan;
  return {
    id: user.id,
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    avatarUrl: profile?.avatar ?? null,
  };
}

export async function getCitizenByUserId(userId: string) {
  const citizen = await prisma.citizen.findUnique({ where: { userId } });
  if (!citizen) throw new NotFoundError("Profil citoyen");
  return citizen;
}

export async function getCitizenIdByUserId(userId: string): Promise<string> {
  return (await getCitizenByUserId(userId)).id;
}

export async function getArtisanByUserId(userId: string) {
  const artisan = await prisma.artisan.findUnique({ where: { userId } });
  if (!artisan) throw new NotFoundError("Profil artisan");
  return artisan;
}

export async function getArtisanIdByUserId(userId: string): Promise<string> {
  return (await getArtisanByUserId(userId)).id;
}

export async function getMissionByJobId(jobId: string) {
  const mission = await prisma.mission.findUnique({
    where: { jobId },
    include: {
      citizen: { select: { id: true, userId: true } },
      artisan: { select: { id: true, userId: true } },
      job: { select: { id: true, status: true, lat: true, lng: true, title: true } },
    },
  });
  if (!mission) throw new NotFoundError("Mission");
  return mission;
}
