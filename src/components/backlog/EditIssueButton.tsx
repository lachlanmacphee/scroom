import { FiEdit } from "react-icons/fi";

type editHandler = () => void;

function EditIssueButton({ editHandler }: { editHandler: editHandler }) {
  return (
    <button
      className="h-8 rounded px-4 font-semibold text-white hover:bg-blue-600"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => editHandler()}
    >
      <FiEdit fontSize="1.5em" />
    </button>
  );
}

export default EditIssueButton;
