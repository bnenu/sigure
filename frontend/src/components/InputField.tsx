import React from "react";

export type InputFieldProps = {
  onChange: (e: any) => void;
  name: string;
  label?: string;
  type?: string;
  value?: string;
  placeholder?: string;
};

export const InputField = ({
  onChange,
  name,
  label,
  type = "text",
  value,
  placeholder = "",
}: InputFieldProps): JSX.Element => {
  return (
    <div>
      <label
        htmlFor={name}
        className="lock text-sm font-medium text-gray-700"
      >{`${label || name} `}</label>
      <div className="mt-1">
        <input
          type={type}
          id={name}
          onChange={onChange}
          value={value}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
