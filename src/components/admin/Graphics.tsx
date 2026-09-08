/**
 * Brand marks for the CMS. `Icon` shows in the nav bar, `Logo` on the login
 * screen — the same padlock used across the public site, so staff land
 * somewhere that looks like their own business rather than a generic tool.
 */

const Padlock = ({ size = 24 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
)

export const Icon = () => (
  <div className="brand-icon">
    <Padlock size={20} />
  </div>
)

export const Logo = () => (
  <div className="brand-logo">
    <div className="brand-logo__mark">
      <Padlock size={30} />
    </div>
    <div className="brand-logo__text">
      <strong>888 Lock &amp; Key</strong>
      <span>Content Management</span>
    </div>
  </div>
)
