"use client";

import { networkAtom } from "@/components/atoms";
import styles from "@/styles/sections/IndexSection/components/BalanceViewer/BalanceViewer.module.css";
import { Button, LinkIcon } from "@nextui-org/react";
import { useAtom } from "jotai";
import Link from "next/link";
import path from "path";
import { FC, useEffect, useState } from "react";
import { Client } from "xrpl";

type Props = {
  xrplAddress: string;
};
export const BalanceViewer: FC<Props> = ({ xrplAddress }) => {
  const [network, _] = useAtom(networkAtom);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchXrpBalance = async () => {
      const client = new Client(network.url);
      await client.connect();

      const balance = await client.getXrpBalance(xrplAddress);
      setBalance(Number(balance));

      await client.disconnect();
    };
    if (xrplAddress) {
      fetchXrpBalance();
    }
  }, [network.url, xrplAddress]);

  return (
    <div className={styles.container}>
      <Link
        href={path.join(network.explorer, `accounts/${xrplAddress}`)}
        target="_blank"
      >
        <Button radius="full" color="primary" variant="flat">
          <LinkIcon />
          {xrplAddress}
        </Button>
      </Link>
      <div className={styles.balance}>{balance} XRP</div>
    </div>
  );
};
