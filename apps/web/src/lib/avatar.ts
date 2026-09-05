const AVATAR_CLASSES = [
  "bg-avatar-1",
  "bg-avatar-2",
  "bg-avatar-3",
  "bg-avatar-4",
  "bg-avatar-5",
] as const;

export function avatarBgClass(initials: string): (typeof AVATAR_CLASSES)[number] {
  let hash = 0;
  for (let i = 0; i < initials.length; i += 1) {
    hash = (hash * 31 + initials.charCodeAt(i)) | 0;
  }
  return AVATAR_CLASSES[Math.abs(hash) % AVATAR_CLASSES.length] ?? "bg-avatar-1";
}
