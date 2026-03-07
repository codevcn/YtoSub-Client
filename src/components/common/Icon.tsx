import React from 'react';

export type IconName = 'upload' | 'play' | 'info' | 'check' | 'close' | 'fullscreen' | 'fullscreen-exit' | 'arrow-up' | 'arrow-down' | 'chevron-right' | 'chevron-left' | 'bg-opacity';

type IconProps = React.SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number | string;
}

export function Icon({ name, size = 24, className, ...props }: IconProps) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    ...props
  };

  switch (name) {
    case 'upload':
      return (
        <svg {...commonProps}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      );
    case 'play':
      return (
        <svg {...commonProps} fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      );
    case 'info':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case 'check':
      return (
        <svg {...commonProps}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
    case 'close':
      return (
        <svg {...commonProps}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      );
    case 'fullscreen':
      return (
        <svg {...commonProps}>
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
      );
    case 'fullscreen-exit':
      return (
        <svg {...commonProps}>
          <polyline points="4 14 10 14 10 20" />
          <polyline points="20 10 14 10 14 4" />
          <line x1="10" y1="14" x2="3" y2="21" />
          <line x1="21" y1="3" x2="14" y2="10" />
        </svg>
      );
    case 'arrow-up':
      return (
        <svg {...commonProps}>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      );
    case 'arrow-down':
      return (
        <svg {...commonProps}>
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...commonProps}>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg {...commonProps}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      );
    case 'bg-opacity':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" />
          <path d="M12 3 A9 9 0 0 1 12 21 Z" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
