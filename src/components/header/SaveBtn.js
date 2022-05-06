import React from "react";
import Router from "next/router";
import { useAsyncFn } from "react-use";

export default function SaveBtn({ data }) {
  const [state, handleSave] = useAsyncFn(async () => {
    const response = await window.fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/pen",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();

    Router.push(`/pen/${result.id}`);
    return result;
  }, [data]);

  return (
    <button
      type="button"
      disabled={state.loading}
      className="inline-flex justify-center items-center h-10 ml-2 mr-4 rounded border border-transparent bg-blue-500 px-5 text-sm font-medium text-blue-50 hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      onClick={handleSave}
    >
      {state.loading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-5 h-5 -ml-1 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      )}
      <span>保存</span>
    </button>
  );
}
