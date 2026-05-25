import { z } from "zod";

export const cursorListQuerySchema = z.object({
  cursor: z.string().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CursorListQuery = z.infer<typeof cursorListQuerySchema>;

export interface CursorPageInfo {
  nextCursor: string | null;
  hasMore: boolean;
  limit: number;
}

export interface CursorListResult<T> {
  items: T[];
  pageInfo: CursorPageInfo;
}

export function encodeCursor(createdAt: Date, id: string): string {
  return Buffer.from(`${createdAt.toISOString()}|${id}`).toString("base64url");
}

export function decodeCursor(cursor: string): { createdAt: Date; id: string } | null {
  try {
    const raw = Buffer.from(cursor, "base64url").toString("utf8");
    const sep = raw.lastIndexOf("|");
    if (sep <= 0) return null;
    const iso = raw.slice(0, sep);
    const id = raw.slice(sep + 1);
    const createdAt = new Date(iso);
    if (Number.isNaN(createdAt.getTime()) || !id) return null;
    return { createdAt, id };
  } catch {
    return null;
  }
}

/** Keyset pagination filter for descending (createdAt, id) order. */
export function cursorWhereDesc(cursor?: string): Record<string, unknown> | undefined {
  const decoded = cursor ? decodeCursor(cursor) : null;
  if (!decoded) return undefined;
  return {
    OR: [
      { createdAt: { lt: decoded.createdAt } },
      { AND: [{ createdAt: decoded.createdAt }, { id: { lt: decoded.id } }] },
    ],
  };
}

export function buildCursorPage<T extends { id: string; createdAt: Date }>(
  rows: T[],
  limit: number,
): CursorListResult<T> {
  const hasMore = rows.length > limit;
  const items = hasMore ? rows.slice(0, limit) : rows;
  const last = items[items.length - 1];
  return {
    items,
    pageInfo: {
      limit,
      hasMore,
      nextCursor: hasMore && last ? encodeCursor(last.createdAt, last.id) : null,
    },
  };
}
