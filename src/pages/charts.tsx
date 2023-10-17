// Libraries
import React from "react";
import { prisma } from "~/server/db";
import { getSession } from "next-auth/react";

// Components
import BurndownChart from "~/components/charts/BurndownChart";
import ContributionChart from "~/components/charts/ContributionChart";

// Functions
import {
  convertToBurndownData,
  convertToContributionData,
} from "~/utils/funcs";

// Types
import { type GetServerSidePropsContext } from "next";
import {
  type ContributionDataType,
  type ActualGraphDataType,
  type ExpectedGraphDataType,
} from "~/utils/types";

export default function Charts({
  actualBurndownData,
  expectedBurndownData,
  contributionData,
}: {
  actualBurndownData: ActualGraphDataType[];
  expectedBurndownData: ExpectedGraphDataType[];
  contributionData: ContributionDataType[];
}) {
  return (
    <div className="flex flex-grow flex-col justify-center gap-2 bg-white p-4 dark:bg-slate-700">
      <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow  dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Burndown
        </h2>
        <BurndownChart
          actualData={actualBurndownData}
          expectedData={expectedBurndownData}
        />
      </div>
      <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Contribution
        </h2>
        <ContributionChart contributionData={contributionData} />
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);
  const teamId = session?.user.teamId;

  if (!teamId) {
    return {
      props: {},
    };
  }

  const users = await prisma.user.findMany({
    where: {
      teamId,
    },
  });

  const issues = await prisma.issue.findMany({
    where: {
      teamId,
      backlog: "sprint",
    },
    orderBy: {
      dateCompleted: "asc",
    },
  });

  const sprints = await prisma.sprint.findMany({
    where: {
      teamId,
    },
  });

  const { actualBurndownData, expectedBurndownData } = convertToBurndownData(
    issues,
    sprints,
  );

  const contributionData = convertToContributionData(issues, users);

  return {
    props: { actualBurndownData, expectedBurndownData, contributionData },
  };
}
