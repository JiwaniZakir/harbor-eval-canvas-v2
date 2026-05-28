/* Shared result type for server actions (kept out of `'use server'` files,
   which may only export async functions). */
export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };
