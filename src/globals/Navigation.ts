import type { GlobalConfig } from 'payload'
import { anyone, staff } from '../access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Menus',
  admin: { group: 'Settings', description: 'The top menu and the footer link columns.' },
  access: { read: anyone, update: staff },
  fields: [
    {
      name: 'header',
      type: 'array',
      label: 'Top menu',
      admin: { description: 'Keep this to about six items so it fits on one line.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { description: 'e.g. "/services" or "/locations/san-jose"' },
        },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Footer columns',
      maxRows: 8,
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'footerNote', type: 'textarea', admin: { description: 'Small print above the copyright line.' } },
  ],
}
