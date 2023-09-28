import { type ReactNode } from "react";
import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Head>
        <title>scroom</title>
        <meta
          name="description"
          content="The simplest scrum management software"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col">
        <Navbar />
        {children}
      </main>
    </>
  );
}
