import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import Layout from "~/components/core/Layout";
import "~/styles/globals.css";
import { TourProvider } from "@reactour/tour";
import { steps } from "~/utils/tour";
import { type SetStateAction, useState } from "react";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [step, setStep] = useState<number>(0);
  const router = useRouter();

  const setCurrentStep = async (step: SetStateAction<number>) => {
    const cStep = Number(step);
    // Ensures user is on correct page
    if ([0, 1, 2].includes(cStep)) {
      await router.push("/");
    } else if ([3, 4, 5, 6, 7, 8, 9, 10].includes(cStep)) {
      await router.push("/backlog");
    } else if ([11, 12, 13, 14, 15].includes(cStep)) {
      await router.push("/board");
    } else if ([16, 17].includes(cStep)) {
      await router.push("/team");
    }
    setStep(step);
  };

  return (
    <SessionProvider session={session}>
      <TourProvider
        steps={steps}
        currentStep={step}
        setCurrentStep={setCurrentStep}
        styles={{
          popover: (base) => ({
            ...base,
            "--reactour-accent": "#3662e3",
            borderRadius: 10,
          }),
          maskArea: (base) => ({ ...base, rx: 10 }),
          badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
          controls: (base) => ({ ...base, marginTop: 50 }),
          close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </TourProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
