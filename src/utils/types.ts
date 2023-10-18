import { z } from "zod";

export type Points = {
  donePoints: string;
  totalPoints: string;
};

export type PointsDict = Record<string, Points>;

export type onClose = () => void;

export const issueFormSchema = z.object({
  summary: z.string(),
  status: z.string(),
  backlog: z.string(),
  userId: z.string(),
  type: z.string(),
  estimate: z.string(),
});

export const userPartialSchema = z.object({
  name: z.string(),
  image: z.string(),
});

export type UserPartialSchema = z.infer<typeof userPartialSchema>;

export type IssueFormSchema = z.infer<typeof issueFormSchema>;

export const issuePartialSchema = z.object({
  status: z.string(),
});

export type IssuePartialSchema = z.infer<typeof issuePartialSchema>;

export const statusSchema = z.object({
  title: z.string(),
});

export type StatusSchema = z.infer<typeof statusSchema>;

export type UpdateIssueInputs = {
  id: string;
  summary?: string;
  status?: string;
  backlog?: string;
  sprintId?: string | null;
  estimate?: string;
  type?: string;
  userId?: string;
};

export type UpdateIssue = (data: UpdateIssueInputs) => void;

export type AddNewStatusInputs = {
  title: string;
  value: string;
};

export type AddNewStatus = (data: AddNewStatusInputs) => void;
export const dailyScrumFormSchema = z.object({
  yesterday: z.string(),
  today: z.string(),
  blockers: z.string(),
});

export type DailyScrumFormSchema = z.infer<typeof dailyScrumFormSchema>;

export const inviteMemberSchema = z.object({
  toEmail: z.string(),
});

export type InviteMemberSchema = z.infer<typeof inviteMemberSchema>;

export const teamDetailsFormSchema = z.object({
  name: z.string().min(3),
  projectName: z.string().min(3),
});

export type TeamDetailsFormSchema = z.infer<typeof teamDetailsFormSchema>;

export type ActualGraphDataType = {
  day: number;
  actual: number;
};

export type ExpectedGraphDataType = {
  day: number;
  expected: number;
};

export type ContributionDataType = {
  name: string;
  completed: number;
  remaining: number;
};

export type BurndownGraphDataOutput = {
  actualBurndownData: ActualGraphDataType[];
  expectedBurndownData: ExpectedGraphDataType[];
};

export const newSprintSchema = z.object({
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type NewSprintSchema = z.infer<typeof newSprintSchema>;

export const editSprintSchema = z.object({
  id: z.string(),
  name: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

export type EditSprintSchema = z.infer<typeof editSprintSchema>;

