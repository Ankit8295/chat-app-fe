import React, { ComponentProps } from 'react';

export default function Logo(props: ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      width={48}
      height={48}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill={props.fill ? props.fill : 'var(--color-brand-light)'}
        d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5"
      />

      <text
        x="8"
        y="12.5"
        fontSize="6"
        fontWeight="600"
        fill={props.fill ? props.fill : 'var(--color-brand-light)'}
        textAnchor="middle"
      >
        BT
      </text>
    </svg>
  );
}
