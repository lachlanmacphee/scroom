import React, { type ReactNode } from "react";
import { RxCross1 } from "react-icons/rx";
import { type onClose } from "~/utils/types";

export default function Modal({
  onClose,
  title,
  children,
}: {  
  onClose: onClose;
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      <div className="fixed left-1/2 top-1/2 z-10 h-5/6 w-3/5 -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto overflow-x-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="flex items-start justify-between rounded-t border-b p-4 dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title ?? "You forgot a modal title."}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
          >
            <RxCross1 />
            <span className="sr-only">Close modal</span>
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
