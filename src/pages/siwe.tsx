import styles from "@/styles/pages/Siwe.module.css";
import { Button, Spinner } from "@nextui-org/react";
import { getCsrfToken, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function Siwe() {
  const { signMessageAsync } = useSignMessage();
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { data: session } = useSession();

  const router = useRouter();

  const handleLogin = useCallback(async () => {
    try {
      const callbackUrl = "/";
      const nonce = await getCsrfToken();
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Ethereumでこのアプリにログインする",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl,
      });
    } catch (error) {
      console.error(error);
    }
  }, [address, chain?.id, signMessageAsync]);

  useEffect(() => {
    if (isConnected && !session) {
      handleLogin();
    }
  }, [handleLogin, isConnected, session]);

  if (session?.user) {
    router.push("/");

    return (
      <div className={styles.container}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div>
        <Button
          size="lg"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            if (!isConnected) {
              connect();
            } else {
              handleLogin();
            }
          }}
        >
          Ethereumでログイン
        </Button>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}

export default Siwe;
