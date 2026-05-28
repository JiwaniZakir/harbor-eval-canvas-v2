import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Org role hierarchy. Higher number = more privileged.
 */
export const ROLE_RANK = {
  viewer: 1,
  member: 2,
  admin: 3,
  owner: 4,
} as const;

export type OrgRole = keyof typeof ROLE_RANK;

export const ORG_ROLES = Object.keys(ROLE_RANK) as OrgRole[];

export function isOrgRole(value: string): value is OrgRole {
  return value in ROLE_RANK;
}

/**
 * Returns the authenticated user's id, or null if not signed in.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Returns the current user's role in `orgId`, or null if not a member.
 * Mirrors the SQL `org_members.role` and is enforced by RLS regardless.
 */
export async function getOrgRole(orgId: string): Promise<OrgRole | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .maybeSingle();

  if (error || !data) return null;
  return isOrgRole(data.role) ? data.role : null;
}

/**
 * True if the current user is any member of `orgId`.
 */
export async function isOrgMember(orgId: string): Promise<boolean> {
  return (await getOrgRole(orgId)) !== null;
}

/**
 * True if the current user holds at least `minRole` in `orgId`.
 */
export async function hasOrgRole(
  orgId: string,
  minRole: OrgRole,
): Promise<boolean> {
  const role = await getOrgRole(orgId);
  if (!role) return false;
  return ROLE_RANK[role] >= ROLE_RANK[minRole];
}

/**
 * Throws if the current user does not hold at least `minRole` in `orgId`.
 * Use to guard server actions / route handlers.
 */
export async function requireOrgRole(
  orgId: string,
  minRole: OrgRole,
): Promise<OrgRole> {
  const role = await getOrgRole(orgId);
  if (!role || ROLE_RANK[role] < ROLE_RANK[minRole]) {
    throw new Error(
      `Forbidden: requires at least "${minRole}" role in org ${orgId}`,
    );
  }
  return role;
}
