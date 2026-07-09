import { ComponentProps } from 'react';

export default function AddFriendIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 64 64"
      strokeWidth="3"
      stroke="#464455"
      fill="none"
      {...props}
    >
      <circle cx="29.22" cy="16.28" r="11.14" />
      <path d="M41.32,35.69c-2.69-1.95-8.34-3.25-12.1-3.25h0A22.55,22.55,0,0,0,6.67,55h29.9" />
      <circle cx="45.38" cy="46.92" r="11.94" />
      <line x1="45.98" y1="39.8" x2="45.98" y2="53.8" />
      <line x1="38.98" y1="46.8" x2="52.98" y2="46.8" />
    </svg>
  );
}
