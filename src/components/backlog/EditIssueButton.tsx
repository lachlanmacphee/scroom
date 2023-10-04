import { FiEdit } from "react-icons/fi";

type editHandler = () => void;

function EditIssueButton({ editHandler }: { editHandler: editHandler }) {
  return (
    <button
      className="mr-2 inline-flex items-center rounded-lg bg-blue-700 p-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      onClick={() => editHandler()}
    >
      <FiEdit fontSize="1.5em" />
    </button>
  );
}

export default EditIssueButton;
