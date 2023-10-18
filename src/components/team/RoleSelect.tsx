import React from "react";
import { type clickHandlerFunc } from "~/utils/types";

export default function RoleSelect({
  clickHandler,
  role,
}: {
  clickHandler: clickHandlerFunc;
  role: string | null;
}) {
  return (
    <select
      defaultValue={role ?? "guest"}
      className="rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      onChange={(e) => clickHandler(e.target.value)}
      data-testid="roleSelectDropdown"
    >
      <option value="admin">Admin</option>
      <option value="scrumMaster">Scrum Master</option>
      <option value="productOwner">Product Owner</option>
      <option value="proxyProductOwner">Proxy Product Owner</option>
      <option value="developer">Developer</option>
      <option value="guest">Guest</option>
    </select>
  );
}
