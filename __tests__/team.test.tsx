import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamDetailsModal from "~/components/team/TeamDetailsModal";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("next/router", () => jest.requireActual("next-router-mock"));
const team = { id: "teamid", name: "teamname", projectName: "projectName" };

describe("TeamDetailsModal", () => {
  it("renders team name field", () => {
    render(<TeamDetailsModal onClose={() => null} team={team} />);
    const teamNameInput = screen.getByTestId("teamNameField");
    expect(teamNameInput).toBeInTheDocument();
  });
  it("renders project name field", () => {
    render(<TeamDetailsModal onClose={() => null} team={team} />);
    const projectNameInput = screen.getByTestId("projectNameField");
    expect(projectNameInput).toBeInTheDocument();
  });
});
