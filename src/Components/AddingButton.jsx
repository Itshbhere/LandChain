import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddingButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSpeedDial = () => {
    setIsOpen(!isOpen);
  };

  const navigate =useNavigate();

  return (
    <div>
      <div data-dial-init className="fixed end-6 bottom-6 group">
        <div
          id="speed-dial-menu-default"
          className={`flex flex-col items-center mb-4 space-y-2 ${
            isOpen ? 'block' : 'hidden'
          }`}
        >
          <button
            type="button"
            data-tooltip-target="tooltip-share"
            data-tooltip-placement="left"
            className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400"
            onClick={()=>{
                navigate("/DD")
            }}
          >
            <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            >
            <path d="M10 2.55l-7 7V18h5v-5h4v5h5V9.55l-7-7zm0 1.414L16.293 10H13v6H7v-6H3.707L10 3.964z" />
            </svg>

            <span className="sr-only">Share</span>
            
          </button>
          <div
            id="tooltip-share"
            role="tooltip"
            className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
          >
            Share
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
          {/* Repeat similar structure for the other buttons */}
        </div>

        <button
          type="button"
          onClick={toggleSpeedDial}
          aria-controls="speed-dial-menu-default"
          aria-expanded={isOpen}
          className="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              isOpen ? 'rotate-45' : ''
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 1v16M1 9h16"
            />
          </svg>
          <span className="sr-only">Open actions menu</span>
        </button>
      </div>
    </div>
  );
}

export default AddingButton;
