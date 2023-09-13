import { type GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";

export default function ScrumBoard() {
  return <h1>Scrum Board</h1>;
}

// This needs to be added to every page with current Next Auth implementation
// Middleware is not supported for database sessions
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
      },
    };
  }

  return {
    props: {},
  };
}
