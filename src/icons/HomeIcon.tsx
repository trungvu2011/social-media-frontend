import * as React from "react";
import type { JSX } from "react/jsx-runtime";

const HomeIcon = (
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
      d="M2.5 20C1.8125 20 1.22417 19.7764 0.735 19.3291C0.245 18.8811 0 18.3429 0 17.7143V7.42857C0 7.06667 0.0887498 6.72381 0.26625 6.4C0.442916 6.07619 0.6875 5.80952 1 5.6L8.5 0.457143C8.72917 0.304762 8.96875 0.190476 9.21875 0.114286C9.46875 0.0380951 9.72917 0 10 0C10.2708 0 10.5312 0.0380951 10.7812 0.114286C11.0312 0.190476 11.2708 0.304762 11.5 0.457143L19 5.6C19.3125 5.80952 19.5575 6.07619 19.735 6.4C19.9117 6.72381 20 7.06667 20 7.42857V17.7143C20 18.3429 19.7554 18.8811 19.2663 19.3291C18.7763 19.7764 18.1875 20 17.5 20H12.5V12H7.5V20H2.5Z"
      fill="currentColor"
    />
  </svg>
);

export default HomeIcon;
