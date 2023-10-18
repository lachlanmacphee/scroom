// Required
export const defaultColumns = [
  {
    value: "toDo",
    title: "To Do",
  },
  {
    value: "inProgress",
    title: "In Progress",
  },
  {
    value: "done",
    title: "Done",
  },
];

type backlogContainer = {
  title: string;
  id: string;
};

const sprint_backlog: backlogContainer = {
  title: "Sprint Backlog",
  id: "sprint",
};
const product_backlog: backlogContainer = {
  title: "Product Backlog",
  id: "product",
};

export const containers = [sprint_backlog, product_backlog];

export const oneDayInMs = 1000 * 60 * 60 * 24;
