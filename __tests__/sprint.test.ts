/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { sprintExists } from "~/utils/funcs";

describe("check if sprint exists", () => {
  const currentSprints: any = [
    {
      startDate: new Date("2023-10-01"),
      endDate: new Date("2023-10-15"),
    },
  ];

  const data: any = {
    startDate: "2023-10-10",
    endDate: "2023-10-14",
  };

  it("Should return true meaning there already exists a test in this time", () => {
    const result = sprintExists(currentSprints, data);
    expect(result).toEqual(true);
  });
});
