import { type Issue } from "@prisma/client";
import { useRouter } from "next/router";
import { ImBin } from "react-icons/im";

export default function DeleteIssueButton({ issue }: { issue: Issue }) {
  const router = useRouter();

  const deleteHandler = async () => {
    console.log("calling delete handler");
    await fetch(`/api/issues/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ issueId: issue.id }),
    });
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
