import type { ReactNode } from 'react';
import type { IssueIconName } from '../../types/issues';

const paths: Record<IssueIconName, ReactNode> = {
  report: <><path d="M7 3.75h7l4 4v12.5H7z" /><path d="M14 3.75v4h4M10 12h5m-5 3h5" /></>,
  pending: <><circle cx="12" cy="12" r="8.25" /><path d="M12 7.5v5l3.25 2" /></>,
  wrench: <><path d="M14.5 6.2a4.5 4.5 0 0 0-5.8 5.8l-4.4 4.4a1.9 1.9 0 0 0 2.7 2.7l4.4-4.4a4.5 4.5 0 0 0 5.8-5.8l-2.8 2.8-2.7-2.7z" /></>,
  check: <><circle cx="12" cy="12" r="8.25" /><path d="m8.5 12.2 2.3 2.3 4.8-5" /></>,
  person: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20a6.5 6.5 0 0 1 13 0" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14.5" rx="2" /><path d="M8 3.5v4m8-4v4M4 9.5h16m-11 4h2m3 0h1m-6 3h2" /></>,
  image: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="9.5" r="1.5" /><path d="m5 17 4.5-4 3 2.5 2.5-2 4 3.5" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  money: <><rect x="3.5" y="6" width="17" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M7 9.5h.01M17 14.5h.01" /></>,
  room: <><path d="m3.5 10 8.5-6.5 8.5 6.5v9.5h-6v-6h-5v6h-6z" /></>,
  warning: <><path d="m12 3.5 9 16H3z" /><path d="M12 9v4m0 3h.01" /></>,
};

export function IssueIcon({
  name,
  className = 'size-5',
}: {
  name: IssueIconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}
