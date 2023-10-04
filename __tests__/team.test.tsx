import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamDetailsModal from "~/components/team/TeamDetailsButton";
import ResetTeamButton from "~/components/team/ResetTeamButton";
import LeaveTeamButton from "~/components/team/LeaveTeamButton";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("next/router", () => jest.requireActual("next-router-mock"));
const team = { id: "teamid", name: "teamname", projectName: "projectName" };

describe("TeamDetailsModal", () => {
  it("renders team name field", () => {
    render(<TeamDetailsModal team={team} />);
    const teamNameInput = screen.getByTestId("teamNameField");
    expect(teamNameInput).toBeInTheDocument();
  });
  it("renders project name field", () => {
    render(<TeamDetailsModal team={team} />);
    const projectNameInput = screen.getByTestId("projectNameField");
    expect(projectNameInput).toBeInTheDocument();
  });
});

describe("ResetProjectModal", () => {
  it("renders confirmation input", () => {
    render(<ResetTeamButton team={team} />);
    const resetConfirmField = screen.getByTestId("resetConfirmField");
    expect(resetConfirmField).toBeInTheDocument();
  });
  it("renders reset button", () => {
    render(<ResetTeamButton team={team} />);
    const resetButton = screen.getByTestId("resetButton");
    expect(resetButton).toBeInTheDocument();
  });
});

describe("LeaveTeamButton", () => {
  it("renders confirmation input", () => {
    render(<LeaveTeamButton />);
    const leaveConfirmField = screen.getByTestId("leaveConfirmField");
    expect(leaveConfirmField).toBeInTheDocument();
  });
  it("renders leave button", () => {
    render(<LeaveTeamButton />);
    const leaveButton = screen.getByTestId("leaveButton");
    expect(leaveButton).toBeInTheDocument();
  });
});
