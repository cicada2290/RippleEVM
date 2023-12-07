import { Header } from "@/components/Header";
import "@/styles/globals.css";
import styles from "@/styles/pages/App.module.css";
import { NextUIProvider } from "@nextui-org/react";
import { configureChains, createConfig, sepolia } from "@wagmi/core";
import { publicProvider } from "@wagmi/core/providers/public";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { AppProps } from "next/app";

const { publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()],
);

createConfig({
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <NextUIProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          <Header />
          <div className={styles.container}>
            <div className={styles.content}>
              <Component {...pageProps} />
            </div>
          </div>
        </NextThemesProvider>
      </NextUIProvider>
    </SessionProvider>
  );
}
