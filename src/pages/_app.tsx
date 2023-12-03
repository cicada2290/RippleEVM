import { Header } from "@/components/Header";
import "@/styles/globals.css";
import styles from "@/styles/pages/App.module.css";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { WagmiConfig, configureChains, createConfig, mainnet } from "wagmi";
import { arbitrum, optimism, polygon } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum],
  [publicProvider()],
);

const config = createConfig({
  autoConnect: false,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <WagmiConfig config={config}>
        <NextUIProvider>
          <Header />
          <div className={styles.container}>
            <div className={styles.content}>
              <Component {...pageProps} />
            </div>
          </div>
        </NextUIProvider>
      </WagmiConfig>
    </SessionProvider>
  );
}
