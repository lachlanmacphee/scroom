import { type StepType } from "@reactour/tour";

// Change selectors to data-tour
// then use selectors like so
// selector: "[data-tour='paragraph']",
export const steps: StepType[] = [
  {
    // step 0
    selector: "body",
    content:
      "Welcome to scroom! This tour will give you an overview of the application. Click the arrows below or use your keyboard arrows to progress between steps",
  },
  {
    // step 1
    selector: "body",
    content: "This is the dashboard page",
  },
  {
    // step 2
    selector: "#current-issues",
    content:
      "It shows you the issues currently assigned to you in the sprint backlog",
  },
  {
    // step 3
    selector: "body",
    content: "This is the backlog page",
  },
  {
    // step 4
    selector: "#sprint",
    content:
      "This is the sprint backlog. The issues in here are part of the current sprint",
  },
  {
    // step 5
    selector: "#sprint-add-issue-button",
    content: "Click here to create issues for your sprint backlog",
  },
  {
    // step 6
    selector: "#product",
    content:
      "This is the product backlog. The issues in here are for upcoming sprints",
  },
  {
    // step 7
    selector: "#product-add-issue-button",
    content: "Click here to create issues for your product backlog",
  },
  {
    // step 8
    selector: "#sprint-add-issue-button",
    content: "Let's try adding an issue. Click the + button that's highlighted",
    disableActions: true,
  },
  {
    // step 9
    selector: "#upsert-issue-form",
    content: "Fill in the details for an issue here, then click save",
    disableActions: true,
  },
  {
    // step 10
    selector: "#sprint-container",
    content:
      "Look, your new issue! Play around with the buttons once this tutorial finishes to discover what they do. Hint: you can click the summary to change it",
    disableActions: false,
  },
  {
    // step 11
    selector: "body",
    content:
      "This is the scrum board page. It shows you all of the issues in the current sprint",
  },
  {
    // step 12
    selector: "#board-toDo",
    content:
      'All of the issues in this column have the "To Do" status, meaning they have not been started on',
  },
  {
    // step 13
    selector: "#board-inProgress",
    content:
      "All of the issues in this column are in progress. That means they are being actively worked on",
  },
  {
    // step 14
    selector: "#board-done",
    content:
      "All of the issues in this column are complete. Ideally, all of your issues would be in here by the end of a sprint",
  },
  {
    // step 15
    selector: "body",
    content:
      "Try dragging the issue you created previously into another column before moving to the next step",
  },
  {
    // step 16
    selector: "body",
    content:
      "This is the team page. If you're an admin, you'll be able to manage users and the team here. If not, you'll only be able to see your team members.",
  },
  {
    // step 17
    selector: "body",
    content:
      "That's it, the tour's over. You can click your escape key or the x button to finish",
  },
];
