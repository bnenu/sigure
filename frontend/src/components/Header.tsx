import React, { useState } from "react";
import { useAccount } from "../contexts/accountContext";
import { ConnectButton } from "./ConnectButton";
import { ContractInfo } from "./ContractInfo";

export const Header = () => {
  const { account } = useAccount();
  const [viewApprovers, setViewApprovers] = useState(false);

  return (
    <header className="p-8 md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-indigo-900 sm:text-3xl sm:truncate">
          Sigure
        </h2>
        <h4 className="text-lg text-gray-600">The multi-sig wallet</h4>
      </div>
      <div className="relative">
        <button
          onClick={() => setViewApprovers(!viewApprovers)}
          className="text-gray-500 group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none"
        >
          <span>View Approvers</span>
          <svg
            className="text-gray-400 ml-2 h-5 w-5 group-hover:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {viewApprovers && (
          <div className="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
              <ContractInfo />
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {!account ? <ConnectButton /> : <UserAccount account={account} />}
      </div>
    </header>
  );
};

const UserAccount = ({ account }: { account: string }) => {
  return <div>{account}</div>;
};
