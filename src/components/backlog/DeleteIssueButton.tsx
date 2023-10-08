import { type Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { ImBin } from "react-icons/im";
import { api } from "~/utils/api";

export default function DeleteIssueButton({ issue }: { issue: Issue }) {
  const router = useRouter();
  const deleteMutation = api.issue.delete.useMutation();

  const deleteHandler = async () => {
    deleteMutation.mutate({ id: issue.id });
    await router.replace(router.asPath);
  };

  return (
    <button
      className="mr-2 inline-flex items-center rounded-lg bg-red-600 p-2.5 text-center text-sm font-medium text-white"
      onClick={deleteHandler}
    >
      <ImBin fontSize="1.5em" />
    </button>
  );
}
