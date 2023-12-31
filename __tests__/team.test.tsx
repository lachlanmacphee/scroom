import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import TeamDetailsModal from "~/components/team/TeamDetailsButton";
import ResetTeamButton from "~/components/team/ResetTeamButton";
import LeaveTeamButton from "~/components/team/LeaveTeamButton";
import RemoveMemberButton from "~/components/team/RemoveMemberButton";
import MemberStoryPoints from "~/components/team/MemberStoryPoints";
import InviteMemberButton from "~/components/team/InviteMemberButton";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("next/router", () => jest.requireActual("next-router-mock"));
const team = { id: "teamid", name: "teamname", projectName: "projectName" };
const user = {
  id: "userid",
  name: "username",
  teamId: "teamid",
  role: "guest",
  email: null,
  emailVerified: null,
  image: null,
};
const points = { donePoints: "5", totalPoints: "10" };

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

describe("RemoveMemberButton", () => {
  it("renders confirmation input", () => {
    render(<RemoveMemberButton user={user} />);
    const removeConfirmField = screen.getByTestId("removeConfirmField");
    expect(removeConfirmField).toBeInTheDocument();
  });
  it("renders remove button", () => {
    render(<RemoveMemberButton user={user} />);
    const removeButton = screen.getByTestId("removeButton");
    expect(removeButton).toBeInTheDocument();
  });
});

describe("MemberStoryPoints", () => {
  it("renders points display", () => {
    render(<MemberStoryPoints points={points} />);
    const pointsText = screen.getByText("5/10");
    expect(pointsText).toBeInTheDocument();
  });
});

describe("InviteMemberModal", () => {
  it("renders email field", () => {
    render(<InviteMemberButton team={team} />);
    const emailInput = screen.getByTestId("toEmailField");
    expect(emailInput).toBeInTheDocument();
  });
  it("renders new Member button", () => {
    render(<InviteMemberButton team={team} />);
    const newMemberButton = screen.getByTestId("inviteTeamMemberButton");
    expect(newMemberButton).toBeInTheDocument();
  });
});
