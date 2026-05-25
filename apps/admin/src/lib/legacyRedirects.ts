import { redirect } from "next/navigation";

/** Redirect legacy `(admin)` routes to the new `/admin/*` shell. */
export function redirectToAdmin(path: string) {
  redirect(path);
}
