import React from "react";

import { useWalletData } from "../contexts/walletDataContext";

export const ContractInfo = () => {
  const { approvers, quorum } = useWalletData();

  if (!approvers || approvers.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="bg-white shadow overflow-hidden rounded-md md:max-w-md">
        <div className="px-4 py-4 -ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
          <div className="ml-4 mt-2">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Approvers
            </h3>
          </div>
          <div className="ml-4 mt-2 flex-shrink-0">
            {quorum && (
              <h3 className="text-sm leading-6 font-medium text-gray-400">
                Quorum: <span className="text-md text-indigo-900">{quorum}</span>
              </h3>
            )}
          </div>
        </div>
        <ul role="list" className="divide-y divide-gray-200">
          {approvers.map((a: string, i: number) => {
            return (
              <li key={i} className="px-4 py-4 flex align-center justify-start">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                  <svg
                    className="h-3 w-3 text-green-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{a}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
