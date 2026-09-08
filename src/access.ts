import type { Access, FieldAccess } from 'payload'

type Role = 'admin' | 'editor'

const roleOf = (user: unknown): Role | null =>
  user && typeof user === 'object' && 'role' in user ? ((user as { role: Role }).role ?? null) : null

/** Anyone may read published content — this is a public marketing site. */
export const anyone: Access = () => true

/** Signed-in staff (editors + admins). */
export const staff: Access = ({ req: { user } }) => Boolean(user)

/** Admins only — used for anything that can lock people out or break the build. */
export const adminOnly: Access = ({ req: { user } }) => roleOf(user) === 'admin'

/** Field-level variant of the above. */
export const adminFieldOnly: FieldAccess = ({ req: { user } }) => roleOf(user) === 'admin'

/** Admins may edit anyone; editors may only edit their own account. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (roleOf(user) === 'admin') return true
  return { id: { equals: user.id } }
}
