import type React from "react"
export function Discord(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12h6" />
      <path d="M11 18c0 1 1 2 2 2s2-1 2-2v-5" />
      <path d="M9 9v9" />
      <path d="M9 6c0-1.7 1.3-3 3-3h0c1.7 0 3 1.3 3 3v3" />
      <path d="M3 3h18v18H3z" />
    </svg>
  )
}

export function Steam(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12" />
      <path d="M16 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
      <path d="M8 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      <path d="M16 8s0 4-4 4-4 4-4 4" />
    </svg>
  )
}
