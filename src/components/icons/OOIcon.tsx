import type { SVGProps } from 'react';

export function OOIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="64"
      height="28"
      viewBox="0 0 64 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14 28C21.732 28 28 21.732 28 14C28 6.26801 21.732 0 14 0C6.26801 0 0 6.26801 0 14C0 21.732 6.26801 28 14 28ZM36 14C36 6.26801 42.268 0 50 0C57.732 0 64 6.26801 64 14C64 21.732 57.732 28 50 28C42.268 28 36 21.732 36 14Z" />
    </svg>
  );
}
