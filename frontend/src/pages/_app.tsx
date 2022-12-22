import "../styles/globals.css";
import "nprogress/nprogress.css";
import NProgress from "nprogress";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Router } from "next/router";
import { NextPage } from "next";
import { ReactElement, ReactNode, useState } from "react";
import MainLayout from "~/components/layout/MainLayout";
import { useEffectOnce, useLocalStorage } from "usehooks-ts";
import { Provider as JotaiProvider } from "jotai";
import { register } from "~/services/registerServiceWorkers";
import ThemeProvider from "~/context/themeContext";
import { SubscriptionContextProvider } from "~/context/SubscriptionContext";
import { Subscription } from "~/types";
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ?? ((page) => <MainLayout>{page}</MainLayout>);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [_, setIsSupportedSW] = useLocalStorage("supportSW", false);

  useEffectOnce(() => {
    if (!("serviceWorker" in navigator)) {
      console.error("No Service Worker support!");
      return;
    }

    if (!("PushManager" in window)) {
      console.error("No Push API Support!");
      return;
    }

    setIsSupportedSW(true);

    (async function () {
      const subscription = await register();
      if (!subscription) return;

      const parsed = JSON.parse(JSON.stringify(subscription));

      const { expirationTime, ...rest } = parsed;
      console.log({ rest });
      setSubscription(rest);
    })();
  });

  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      <JotaiProvider>
        <SubscriptionContextProvider value={subscription}>
          <ThemeProvider>
            {getLayout(<Component {...pageProps} />)}
          </ThemeProvider>
        </SubscriptionContextProvider>
      </JotaiProvider>
    </SessionProvider>
  );
}
