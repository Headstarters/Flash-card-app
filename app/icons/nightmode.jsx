import React from "react";

export function DarkMode () {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-labelledby="nightModeIconTitle"
      color="#000"
      viewBox="0 0 24 24"
    >
      <path d="M12 19a7 7 0 100-14 7 7 0 000 14z"></path>
      <path d="M15.899 12.899a4 4 0 01-4.797-4.797A4.002 4.002 0 0012 16c1.9 0 3.49-1.325 3.899-3.101zM12 5V3m0 18v-2M5 12H2h3zm17 0h-3 3zm-5.05-4.95l2.12-2.12-2.12 2.12zM4.929 19.071L7.05 16.95l-2.12 2.12zM16.95 16.95l2.121 2.121-2.121-2.121zM4.929 4.929L7.05 7.05 4.93 4.93z"></path>
    </svg>
  );
}

 export const LightMode = (props) => {
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="Icons"
    viewBox="0 0 32 32"
    width={50}
    height={50}
    {...props}
  >
    <style>
      {
        ".st0{fill:none;stroke:#000;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}"
      }
    </style>
    <circle cx={16} cy={16} r={8} className="st0" />
    <path
      d="M16 2v6M9 3.9l3 5.2M3.9 9l5.2 3M2 16h6M3.9 23l5.2-3M9 28.1l3-5.2M16 30v-6M23 28.1l-3-5.2M28.1 23l-5.2-3M30 16h-6M28.1 9l-5.2 3M23 3.9l-3 5.2"
      className="st0"
    />
  </svg>
 }

export const  MultiColorMode = () =>{
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="50"
      height="50"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <path
        fill="#FFC61B"
        d="M255.999 422.308c-91.702 0-166.307-74.606-166.307-166.308S164.299 89.692 255.999 89.692c44.423 0 86.186 17.299 117.598 48.711 6.213 6.213 6.213 16.287 0 22.502-6.215 6.211-16.286 6.211-22.502 0-25.401-25.402-59.173-39.391-95.097-39.391-74.156 0-134.486 60.33-134.486 134.488s60.33 134.488 134.486 134.488 134.486-60.33 134.486-134.488c0-8.787 7.125-15.91 15.91-15.91 8.786 0 15.91 7.123 15.91 15.91.004 91.701-74.603 166.306-166.305 166.306z"
      ></path>
      <path
        fill="#FEE187"
        d="M255.999 105.603c-83.063 0-150.398 67.335-150.398 150.398s67.335 150.398 150.398 150.398V105.603z"
      ></path>
      <g fill="#FFC61B">
        <path d="M255.999 422.308c-91.702 0-166.307-74.606-166.307-166.308S164.299 89.692 255.999 89.692c8.786 0 15.91 7.123 15.91 15.91v300.796c0 8.787-7.123 15.91-15.91 15.91zm-15.91-299.861c-66.686 7.895-118.576 64.777-118.576 133.552s51.89 125.658 118.576 133.552V122.447z"></path>
        <path d="M255.999 113.182c-8.786 0-15.91-7.123-15.91-15.91V15.91c0-8.787 7.125-15.91 15.91-15.91s15.91 7.123 15.91 15.91v81.362c0 8.787-7.123 15.91-15.91 15.91zM255.999 512c-8.786 0-15.91-7.123-15.91-15.91v-81.362c0-8.787 7.125-15.91 15.91-15.91s15.91 7.123 15.91 15.91v81.362c0 8.787-7.123 15.91-15.91 15.91zM496.09 271.909h-89.692c-8.786 0-15.91-7.123-15.91-15.91s7.125-15.91 15.91-15.91h89.692c8.786 0 15.91 7.123 15.91 15.91s-7.125 15.91-15.91 15.91zM97.272 271.909H15.91c-8.786 0-15.91-7.123-15.91-15.91s7.125-15.91 15.91-15.91h81.362c8.786 0 15.91 7.123 15.91 15.91s-7.124 15.91-15.91 15.91zM362.347 165.564a15.857 15.857 0 01-11.25-4.66c-6.213-6.213-6.213-16.287 0-22.502l63.421-63.421c6.215-6.213 16.286-6.213 22.502 0 6.213 6.213 6.213 16.287 0 22.502l-63.421 63.421a15.875 15.875 0 01-11.252 4.66zM86.23 441.678a15.857 15.857 0 01-11.25-4.66c-6.213-6.213-6.213-16.287 0-22.502l57.531-57.531c6.215-6.213 16.286-6.213 22.502 0 6.213 6.213 6.213 16.287 0 22.502l-57.531 57.531a15.865 15.865 0 01-11.252 4.66zM425.768 441.678a15.857 15.857 0 01-11.25-4.66l-57.531-57.531c-6.213-6.213-6.213-16.287 0-22.502 6.215-6.213 16.286-6.213 22.502 0l57.531 57.531c6.213 6.213 6.213 16.287 0 22.502a15.862 15.862 0 01-11.252 4.66zM143.762 159.672a15.857 15.857 0 01-11.25-4.66L74.98 97.481c-6.213-6.213-6.213-16.287 0-22.502 6.215-6.213 16.286-6.213 22.502 0l57.531 57.531c6.213 6.213 6.213 16.287 0 22.502a15.86 15.86 0 01-11.251 4.66z"></path>
      </g>
    </svg>
  );
}




