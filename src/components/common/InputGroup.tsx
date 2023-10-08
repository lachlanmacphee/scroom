import React, { type ComponentPropsWithoutRef } from "react";

interface InputGroupProps extends ComponentPropsWithoutRef<"input"> {
  htmlFor: string;
  label: string;
}

export default function InputGroup({
  htmlFor,
  label,
  ...rest
}: InputGroupProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
      >
        {label}
      </label>
      <input
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        {...rest}
      />
    </div>
  );
}
