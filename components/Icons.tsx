import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  strokeWidth?: number;
}

const BaseIcon: React.FC<IconProps> = ({ size = 20, strokeWidth = 1.5, children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {children}
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </BaseIcon>
);

export const LayoutGridIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </BaseIcon>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
  </BaseIcon>
);

export const GitBranchIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 0 1-9 9" />
  </BaseIcon>
);

export const SearchIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </BaseIcon>
);

export const SettingsIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.35a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </BaseIcon>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="9 18 15 12 9 6" />
  </BaseIcon>
);

export const ChevronUpIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="18 15 12 9 6 15" />
  </BaseIcon>
);

export const ChevronDownIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="6 9 12 15 18 9" />
  </BaseIcon>
);

export const FileTextIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
  </BaseIcon>
);

export const CommandIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
  </BaseIcon>
);

export const AlertCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </BaseIcon>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </BaseIcon>
);

export const ActivityIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </BaseIcon>
);

export const LoaderIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </BaseIcon>
);

export const XCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </BaseIcon>
);

export const RefreshCwIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M8 16H3v5" />
  </BaseIcon>
);

export const CpuIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3" />
    <path d="M15 1v3" />
    <path d="M9 20v3" />
    <path d="M15 20v3" />
    <path d="M20 9h3" />
    <path d="M20 14h3" />
    <path d="M1 9h3" />
    <path d="M1 14h3" />
  </BaseIcon>
);

export const ShieldIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </BaseIcon>
);

export const HardDriveIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <line x1="22" y1="12" x2="2" y2="12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    <line x1="6" y1="16" x2="6.01" y2="16" />
    <line x1="10" y1="16" x2="10.01" y2="16" />
  </BaseIcon>
);

export const ZapIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </BaseIcon>
);

export const PackageIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props}>
    <path d="m16.5 9.4-9-5.19" />
    <path d="m21 16-9 5.19-9-5.19" />
    <path d="m3.11 6 9 5.19 9-5.19" />
    <path d="m12 11.19v10.39" />
  </BaseIcon>
);