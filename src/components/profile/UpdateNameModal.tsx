/* eslint-disable @typescript-eslint/no-floating-promises */
import Modal from "../common/Modal";
import {
  type UserPartialSchema,
  type onClose,
  userPartialSchema,
} from "~/utils/types";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function UpdateNameModal({
  onClose,
  userID,
  name,
  image,
}: {
  onClose: onClose;
  name: string | null;
  userID: string;
  image: string | null;
}) {
  const router = useRouter();
  const updateMutation = api.user.updateName.useMutation();

  const { register, handleSubmit } = useForm<UserPartialSchema>({
    resolver: zodResolver(userPartialSchema),
    defaultValues: {
      name: name ?? "",
      image: image ?? "",
    },
  });

  const onSubmit = (data: UserPartialSchema) => {
    updateMutation.mutate(
      { ...data, id: userID},
      { onSuccess: endSubmit },
    );
  };

  const endSubmit = async () => {
    onClose();
    await router.replace(router.asPath);
  };

  return (
    <Modal title={"Update Name / Image "} onClose={onClose}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4"
        id="upsert-name-form"
      >
        <label className="font-bold dark:text-white text-m">Update Name</label>
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          id="name"
          {...register("name")}
        />
        <label className="font-bold dark:text-white">Update Image Link</label>
        <input
          type="text"
          data-testid="image"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
          {...register("image", { required: true })}
        />

        <div className="flex items-center justify-end space-x-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Update
          </button>
        </div>
      </form>
    </Modal>
  );
}
