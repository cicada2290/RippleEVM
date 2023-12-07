"use client";

import { networkAtom } from "@/components/atoms";
import styles from "@/styles/sections/IndexSection/components/BalanceViewer/BalanceViewer.module.css";
import { Button, LinkIcon } from "@nextui-org/react";
import { fetchBalance } from "@wagmi/core";
import { useAtom } from "jotai";
import Link from "next/link";
import path from "path";
import { FC, useEffect, useState } from "react";
import { Client } from "xrpl";

type Props = {
  evmAddress: `0x${string}`;
  xrplAddress: string;
};
export const BalanceViewer: FC<Props> = ({ evmAddress, xrplAddress }) => {
  const [network, _] = useAtom(networkAtom);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchMyBalance = async () => {
      setBalance(0);

      if (network.type === "xrpl") {
        const client = new Client(network.url);
        await client.connect();

        try {
          const balance = await client.getXrpBalance(xrplAddress);
          setBalance(Number(balance));
        } catch (e: any) {
          setBalance(0);
          console.error(e.message);
        }

        await client.disconnect();
      } else {
        const response = await fetchBalance({
          address: evmAddress,
          chainId: network.chainId,
        });
        setBalance(Number(response.formatted));
      }
    };

    if (evmAddress || xrplAddress) {
      fetchMyBalance();
    }
  }, [network, evmAddress, xrplAddress]);

  return (
    <div className={styles.container}>
      <Link
        href={path.join(network.explorer, `accounts/${xrplAddress}`)}
        target="_blank"
      >
        <Button radius="full" color="primary" variant="flat">
          {xrplAddress}
          <LinkIcon />
        </Button>
      </Link>
      <div className={styles.balance}>
        {balance} {network.currency}
      </div>
    </div>
  );
};
