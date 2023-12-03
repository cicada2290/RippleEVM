"use client";

import { Center } from "@/components/Center";
import { networkAtom } from "@/components/atoms";
import styles from "@/styles/sections/IndexSection/components/BalanceViewer/BalanceViewer.module.css";
import { Button, LinkIcon, Spinner } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
import Link from "next/link";
import path from "path";
import { useEffect, useState } from "react";
import { Client } from "xrpl";

export const BalanceViewer = () => {
  const [network, _] = useAtom(networkAtom);
  const [balance, setBalance] = useState(0);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchXrpBalance = async () => {
      const client = new Client(network.url);
      await client.connect();

      const balance = await client.getXrpBalance(
        (session as Session).user.xrplAddress,
      );
      setBalance(Number(balance));

      await client.disconnect();
    };
    if ((session as Session)?.user?.xrplAddress) {
      fetchXrpBalance();
    }
  }, [network.url, session]);

  if (!session) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <div className={styles.container}>
      <Link
        href={path.join(
          network.explorer,
          `accounts/${(session as Session).user.xrplAddress}`,
        )}
        target="_blank"
      >
        <Button radius="full" color="primary" variant="flat">
          <LinkIcon />
          {(session as Session).user.xrplAddress}
        </Button>
      </Link>
      <div className={styles.balance}>{balance} XRP</div>
    </div>
  );
};
