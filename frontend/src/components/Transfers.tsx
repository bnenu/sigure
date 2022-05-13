import React, { useEffect, useState, useCallback } from "react";
import { useContract } from "../contexts/contractContext";
import { useAccount } from "../contexts/accountContext";
import { useWalletData } from "../contexts/walletDataContext";
import { parseError } from "../utils/errors";
import { TransferList } from "./TransferList";
import { TransferForm, TransferData } from "./TransferForm";

export const Transfers = () => {
  const { account, accountProvider } = useAccount();
  const { contract } = useContract();
  const { transfers, isApprover, fetchTransfers } = useWalletData();
  const [showTransferForm, setShowTransferForm] = useState(false);

  const createTransfer = async (transfer: TransferData) => {
    if (isApprover) {
      const signer = accountProvider?.getSigner();
      const contractWithSigner = contract?.connect(signer);

      try {
        await contractWithSigner?.createTransfer(transfer.amount, transfer.to);
        await fetchTransfers();
      } catch (err) {
        const [error, body] = parseError(err);

        if (body?.error?.message) {
          console.error(body?.error?.message);
        }
      }
    }
  };

  const approveTransfer = async (transferId: any) => {
    if (isApprover) {
      const signer = accountProvider?.getSigner();
      const contractWithSigner = contract?.connect(signer);
      try {
        await contractWithSigner?.approveTransfer(transferId);
        await fetchTransfers();
      } catch (err) {
        const [error, body] = parseError(err);

        if (body?.error?.message) {
          console.error(body?.error?.message);
        }
      }
    }
  };

  const toggleMakeTransfer = () => {
    setShowTransferForm((s) => !s);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Transfers</h1>
          <p className="mt-2 text-sm text-gray-400">
            A list of all the transfers requested
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {isApprover && (
            <button
              onClick={toggleMakeTransfer}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add transfer
            </button>
          )}
        </div>
      </div>
      {showTransferForm && <TransferForm onSubmit={createTransfer} onClose={toggleMakeTransfer} />}
      {transfers && (
        <div className="mt-8 flex flex-col px-4 sm:px-6 lg:px-8">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
                <TransferList
                  transfers={transfers}
                  approveTransfer={approveTransfer}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
