import type { ReactElement, SVGProps } from 'react'

export type IconName =
  | 'car'
  | 'home'
  | 'building'
  | 'key'
  | 'smart'
  | 'shield'
  | 'lock'
  | 'clock'
  | 'people'
  | 'star'
  | 'phone'
  | 'arrow'
  | 'pin'
  | 'bolt'
  | 'check'
  | 'chevron'
  | 'search'
  | 'info'

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const paths: Record<IconName, ReactElement> = {
  car: (
    <g {...stroke}>
      <path d="M3 13l1.9-5.1A2.6 2.6 0 0 1 7.3 6h9.4a2.6 2.6 0 0 1 2.4 1.9L21 13v5h-3v-2H6v2H3z" />
      <circle cx="7" cy="15.5" r="1.2" />
      <circle cx="17" cy="15.5" r="1.2" />
    </g>
  ),
  home: (
    <g {...stroke}>
      <path d="M3 11l9-7 9 7" />
      <path d="M5.5 9.7V20h13V9.7" />
      <path d="M10 20v-5h4v5" />
    </g>
  ),
  building: (
    <g {...stroke}>
      <path d="M4 21V4h9v17" />
      <path d="M13 9h7v12" />
      <path d="M7 8h3M7 12h3M7 16h3M16 13h1M16 17h1" />
    </g>
  ),
  key: (
    <g {...stroke}>
      <circle cx="8" cy="8.5" r="4.5" />
      <path d="M11.4 11.6L20 20.2" />
      <path d="M17.2 17.4l2-2" />
      <path d="M14.6 14.8l1.8-1.8" />
    </g>
  ),
  smart: (
    <g {...stroke}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="15.5" r="1.4" />
    </g>
  ),
  shield: (
    <g {...stroke}>
      <path d="M12 2.6l7.5 3.3v5.4c0 4.6-3.2 8.4-7.5 9.9-4.3-1.5-7.5-5.3-7.5-9.9V5.9z" />
      <path d="M8.8 12l2.2 2.2 4.2-4.3" />
    </g>
  ),
  lock: (
    <g {...stroke}>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </g>
  ),
  clock: (
    <g {...stroke}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </g>
  ),
  people: (
    <g fill="currentColor">
      <circle cx="9" cy="8" r="3.4" />
      <path d="M2.4 19.4c0-3.4 2.9-5.6 6.6-5.6s6.6 2.2 6.6 5.6z" />
      <circle cx="17.2" cy="9" r="2.6" />
      <path d="M15 14.1c.7-.2 1.5-.3 2.2-.3 3 0 4.9 1.7 4.9 4.3h-4.4c0-1.6-1-3-2.7-4z" />
    </g>
  ),
  star: (
    <g fill="currentColor">
      <path d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5L2.5 9.5l6.6-.9z" />
    </g>
  ),
  phone: (
    <g {...stroke} strokeWidth={2.2}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
    </g>
  ),
  arrow: (
    <g {...stroke} strokeWidth={2.4}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </g>
  ),
  pin: (
    <g {...stroke} strokeWidth={2}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </g>
  ),
  bolt: (
    <g fill="currentColor">
      <path d="M13.4 2L4 13.4h6.1L9.6 22 20 10.2h-6.4z" />
    </g>
  ),
  check: (
    <g {...stroke} strokeWidth={2.4}>
      <path d="M4 12.5l5 5 11-11" />
    </g>
  ),
  chevron: (
    <g {...stroke} strokeWidth={2.5}>
      <path d="M6 9l6 6 6-6" />
    </g>
  ),
  search: (
    <g {...stroke} strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </g>
  ),
  info: (
    <g {...stroke} strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M12 11v5" />
    </g>
  ),
}

type Props = SVGProps<SVGSVGElement> & { name: IconName }

export const Icon = ({ name, width = 18, height = 18, style, ...rest }: Props) => (
  <svg
    viewBox="0 0 24 24"
    width={width}
    height={height}
    aria-hidden="true"
    focusable="false"
    style={{ flexShrink: 0, ...style }}
    {...rest}
  >
    {paths[name]}
  </svg>
)

export const GoogleG = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
)
