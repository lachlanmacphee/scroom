/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  convertToBurndownData,
  convertToContributionData,
} from "~/utils/funcs";

describe("convertToBurndownData", () => {
  const issues: any = [
    { estimate: "5", dateCompleted: new Date("2023-10-11"), status: "done" },
    { estimate: "3", dateCompleted: new Date("2023-10-12"), status: "done" },
  ];
  const sprints: any = [
    {
      startDate: new Date("2023-10-10"),
      endDate: new Date("2023-10-14"),
    },
  ];

  it("should return default burndown data if no current sprint is found", () => {
    const result = convertToBurndownData(issues, []);
    expect(result).toEqual({
      actualBurndownData: [],
      expectedBurndownData: [],
    });
  });

  it("should return default burndown data if there are no completed issues", () => {
    const issues: any = [{ estimate: "5", status: "toDo" }];
    const result = convertToBurndownData(issues, sprints);
    expect(result).toEqual({
      actualBurndownData: [],
      expectedBurndownData: [],
    });
  });

  it("should calculate burndown data correctly for a valid sprint", () => {
    const result = convertToBurndownData(
      issues,
      sprints,
      new Date("2023-10-14").getTime(),
    );

    // Ensure the actual burndown data is correctly calculated
    expect(result.actualBurndownData).toEqual([
      { day: 0, actual: 8 },
      { day: 1, actual: 3 },
      { day: 2, actual: 0 },
    ]);

    // Ensure the expected burndown data is correct
    expect(result.expectedBurndownData).toEqual([
      { day: 0, expected: 8 },
      { day: 4, expected: 0 },
    ]);
  });
});

describe("convertToContributionData", () => {
  const issues: any = [
    { estimate: "5", status: "done", userId: "user1" },
    { estimate: "3", status: "inProgress", userId: "user2" },
    { estimate: "2", status: "done", userId: "user1" },
    { estimate: "1", status: "toDo", userId: "user3" },
  ];
  const users: any = [
    { id: "user1", name: "User One" },
    { id: "user2", name: "User Two" },
  ];

  it("should return an empty array if there are no issues", () => {
    const result = convertToContributionData([], users);
    expect(result).toEqual([]);
  });

  it("should calculate contribution data correctly", () => {
    const result = convertToContributionData(issues, users);

    // Ensure that the result contains the expected contribution data for each user
    expect(result).toEqual([
      {
        name: "User One",
        completed: 7,
        remaining: 0,
      },
      {
        name: "User Two",
        completed: 0,
        remaining: 3,
      },
    ]);
  });
});
