// Decorative pieces shared by store buttons

// Animated "stitched" outline drawn around .stitch buttons on hover
export function Outline() {
  return (
    <svg className="outline" aria-hidden="true">
      <rect className="solid" x="0" y="0" width="100%" height="100%" pathLength={1} />
      <rect className="dash" x="0" y="0" width="100%" height="100%" pathLength={1} />
    </svg>
  );
}

export function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.6 8.6 0 0 1-4-1L3 21l1.7-4.6A8.4 8.4 0 0 1 3.6 12 8.5 8.5 0 1 1 21 11.5z" />
    </svg>
  );
}

export function BagIcon() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

// Lets CSS custom properties (e.g. --r, --i) be passed through style props
export const cssVars = (vars: Record<string, string | number>) => vars as React.CSSProperties;
