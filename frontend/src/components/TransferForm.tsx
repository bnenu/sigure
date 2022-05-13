import React, { useState } from "react";
import { InputField } from "./InputField";

export type TransferData = {
  to: string;
  amount: string;
};

export type TransferFormProps = {
  onSubmit: (arg0: TransferData) => Promise<void> | void;
  onClose: () => void;
};

const initialFormState: TransferData = {
  to: "",
  amount: "",
};

const isValid = (formData: TransferData): boolean => {
  const { to, amount } = formData;
  return !!(to && to.length && amount && amount.length);
};

export const TransferForm = ({ onSubmit, onClose }: TransferFormProps): JSX.Element => {
  const [formData, setFormData] = useState<TransferData>(initialFormState);

  const handleSubmit = async (ev: any) => {
    ev.preventDefault();

    await onSubmit(formData);
    setFormData(initialFormState);
    onClose()
  };

  const handleChange = (field: string) => (event: any) => {
    const { value } = event.target;
    setFormData((s) => {
      return {
        ...s,
        [field]: value,
      };
    });
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
            <div className="pb-4">
              <h3 className="text-l font-bold">Add a new transfer</h3>
            </div>
            <form onSubmit={handleSubmit} className="">
              <div className="bg-gray-100 p-2 pb-4 mb-4 rounded-md ">
                <div className="w-80">
                  <InputField
                    onChange={handleChange("to")}
                    name={"to"}
                    label={"Transfer to address"}
                    value={formData.to}
                  />
                </div>
                <div className="mt-4 w-80">
                  <InputField
                    onChange={handleChange("amount")}
                    name={"amount"}
                    label={"Amount (in wei)"}
                    value={formData.amount}
                  />
                </div>
              </div>
              <div className="flex flex-row justify-end"> 
                <button
                  onClick={onClose}
                  type="button"
                  className="mr-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isValid(formData)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Request transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
