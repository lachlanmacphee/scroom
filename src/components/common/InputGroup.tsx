import React, { type ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

interface InputGroupProps extends ComponentPropsWithoutRef<"input"> {
  htmlFor: string;
  label: string;
  labelStyles?: string;
  inputStyles?: string;
}

export default function InputGroup({
  htmlFor,
  label,
  labelStyles,
  inputStyles,
  ...rest
}: InputGroupProps) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className={twMerge(
          "mb-2 block text-sm font-medium text-gray-900 dark:text-white",
          labelStyles,
        )}
      >
        {label}
      </label>
      <input
        name={htmlFor}
        className={twMerge(
          "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500",
          inputStyles,
        )}
        {...rest}
      />
    </div>
  );
}
