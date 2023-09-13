import React from 'react';
import type { Issue } from "@prisma/client";

interface IssueProps {
  issues: Issue[];
  status: string;
}

const IssueComp = ({ issues, status }: IssueProps) => {
  return (
    <div className="w-1/3 bg-gray-200 p-4 rounded-lg mr-4">
      <h2 className="text-lg font-semibold mb-2">{status} ({issues.length})</h2>
      {issues.map((issue) => (
        <div key={issue.id} className="border p-2 mb-2 border-blue-800">
          {issue.summary}
        </div>
      ))}
    </div>
  );
};

export default IssueComp;