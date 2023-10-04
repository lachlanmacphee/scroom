/* eslint-disable @typescript-eslint/no-empty-function */
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import UpsertIssueModal from "~/components/backlog/UpsertIssueModal";

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock("next/router", () => jest.requireActual("next-router-mock"));
const team = { id: "1", name: "teamname", projectName: "projectName" };
const issue = { id: "id", status: "toDo", backlog: "sprint", summary: "summary", teamId: "1", estimate: "estimate", type :"type", userid: "1", assignee: null }
const user = { id: "1", name: "bella", teamId: "1", team: team, role: "admin", email: "email", emailVerified: null, image: null }
const teamUsers = [user]

describe("addIssueModal", () => {
  it("renders summary field", () => {
    render(<UpsertIssueModal onClose={()=>{}} backlog={issue.backlog} teamId={team.id} teamUsers={teamUsers}/>);
    const summary = screen.getByTestId("summary");
    expect(summary).toBeInTheDocument();
  });
  it("renders status field", () => {
    render(<UpsertIssueModal onClose={()=>{}} backlog={issue.backlog} teamId={team.id} teamUsers={teamUsers}/>);
    const status = screen.getByTestId("status");
    expect(status).toBeInTheDocument();
  });
  it("renders Backlog field", () => {
    render(<UpsertIssueModal onClose={()=>{}} backlog={issue.backlog} teamId={team.id} teamUsers={teamUsers}/>);
    const backlog = screen.getByTestId("backlog");
    expect(backlog).toBeInTheDocument();
  });
  it("renders assignee field", () => {
    render(<UpsertIssueModal onClose={()=>{}} backlog={issue.backlog} teamId={team.id} teamUsers={teamUsers}/>);
    const backlog = screen.getByTestId("assignee");
    expect(backlog).toBeInTheDocument();
  });
  it("renders type field", () => {
    render(<UpsertIssueModal onClose={()=>{}} backlog={issue.backlog} teamId={team.id} teamUsers={teamUsers}/>);
    const type = screen.getByTestId("type");
    expect(type).toBeInTheDocument();
  });
  it("renders story point estimate field", () => {
    render(<UpsertIssueModal onClose={()=>{}} backlog={issue.backlog} teamId={team.id} teamUsers={teamUsers}/>);
    const estimate = screen.getByTestId("estimate");
    expect(estimate).toBeInTheDocument();
  });
});
