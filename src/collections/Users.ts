import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSelf, adminFieldOnly } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Branded reset email. Without a configured adapter this used to be written
    // to the server console, so "Forgot password?" appeared to do nothing.
    forgotPassword: {
      generateEmailSubject: () => 'Reset your 888 Lock & Key password',
      generateEmailHTML: (args) => {
        const token = (args as { token?: string })?.token ?? ''
        const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const url = `${site}/admin/reset/${token}`
        return `
        <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;background:#faf8f5;padding:28px">
          <div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden">
            <div style="background:#ea580c;color:#fff;padding:18px 24px;font-size:20px;font-weight:800">
              888 Lock &amp; Key
            </div>
            <div style="padding:24px">
              <p style="color:#334155;font-size:15px;line-height:1.6;margin:0 0 20px">
                Someone asked to reset the password for this admin account.
                Click below to choose a new one. If it wasn't you, ignore this email
                and nothing will change.
              </p>
              <a href="${url}"
                 style="display:inline-block;background:#ea580c;color:#fff;text-decoration:none;padding:14px 30px;border-radius:100px;font-weight:700">
                Set a new password
              </a>
              <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin:22px 0 0">
                Or paste this into your browser:<br>
                <span style="color:#64748b;word-break:break-all">${url}</span>
              </p>
            </div>
          </div>
        </div>`
      },
    },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Admin',
  },
  access: {
    // Only admins hand out logins; editors can still manage their own profile.
    create: adminOnly,
    delete: adminOnly,
    read: adminOrSelf,
    update: adminOrSelf,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Shown in the top-right of the admin bar.' },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      // An editor must not be able to promote themselves to admin.
      access: { create: adminFieldOnly, update: adminFieldOnly },
      options: [
        { label: 'Admin — full access, manages users', value: 'admin' },
        { label: 'Editor — edits content only', value: 'editor' },
      ],
    },
  ],
}
