import React, { ComponentProps } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right';

interface ArrowIconProps extends ComponentProps<'svg'> {
  direction?: Direction;
}

export default function ArrowIcon({
  direction = 'down',
  ...props
}: ArrowIconProps) {
  const getRotation = (dir: Direction): string => {
    switch (dir) {
      case 'right':
        return 'rotate(0deg)';
      case 'up':
        return 'rotate(-90deg)';
      case 'down':
        return 'rotate(90deg)';
      default:
        return 'rotate(180deg)';
    }
  };

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: getRotation(direction),
        transition: 'transform .2s ease',
        willChange: 'transform',
      }}
      {...props}
    >
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
