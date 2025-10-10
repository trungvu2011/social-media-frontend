import * as React from "react";
import type { JSX } from "react/jsx-runtime";
const MessageIcon = (
  props: JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 18.7526C15.5225 18.7526 20 14.5547 20 9.37629C20 4.1979 15.5225 0 10 0C4.4775 0 0 4.1979 0 9.37629C0 11.7338 0.92875 13.8903 2.4625 15.5378C2.34125 16.8988 1.94125 18.3909 1.49875 19.5107C1.4 19.7599 1.59125 20.0385 1.84 19.9956C4.66 19.5 6.33625 18.7392 7.065 18.3427C8.02222 18.6172 9.00909 18.7551 10 18.7526Z"
      fill="currentColor"
    />
  </svg>
);
export default MessageIcon;
