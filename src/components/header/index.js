import React from "react";

export default function Header({ children }) {
  return (
    <div className="h-16 flex-none bg-[#181818] border-b border-gray-700 flex justify-between">
      <div className="flex justify-center items-center h-16 w-28">
        <svg
          className="w-10 h-10"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M512 341.33333336c0-94.4 76.8-171.2 171.2-171.2 94.4 0 171.2 76.8 171.2 171.2s-76.8 171.2-171.2 171.2C588.8 512.53333336 512 435.73333336 512 341.33333336z"
            fill="#FF3C41"
          ></path>
          <path
            d="M171.2 682.13333336c0-94.4 76.8-171.2 171.2-171.2H512v171.2C512 776.53333336 435.2 853.33333336 340.8 853.33333336s-169.6-76.8-169.6-171.2z"
            fill="#0EBEFF"
          ></path>
          <path
            d="M171.2 341.33333336c0 94.4 76.8 171.2 171.2 171.2H512V170.13333336H340.8c-94.4 0-169.6 76.8-169.6 171.2z"
            fill="#FCD000"
          ></path>
          <text fill="#fff" x="520" y="860" fontFamily="Verdana" fontSize="460">
            +
          </text>
        </svg>

        <span className="ml2 text-gray-50">CODE</span>
      </div>
      <div className="flex-auto flex items-center justify-end">{children}</div>
    </div>
  );
}
