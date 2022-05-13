import React from "react";
import { useWalletData } from "../contexts/walletDataContext";

export type TransferListProps = {
  transfers: any[];
  approveTransfer: (arg0: any) => void;
};

export const TransferList = ({
  transfers,
  approveTransfer,
}: TransferListProps): JSX.Element => {
  const { isApprover, approvals } = useWalletData();

  return (
    <>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Id
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Amount
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              To
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Approvals
            </th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Sent
            </th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {transfers.map((t) => {
            return (
              <tr key={t.id}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                  {t.id.toString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {t.amount.toString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {t.to}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {t.approvals.toString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {t.sent ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {" "}
                      Yes{" "}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {" "}
                      No{" "}
                    </span>
                  )}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  {isApprover && !approvals[t.id] && (
                    <button
                      onClick={() => approveTransfer(t.id)}
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
