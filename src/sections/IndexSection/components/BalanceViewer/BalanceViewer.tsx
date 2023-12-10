"use client";

import { networkAtom } from "@/components/atoms";
import styles from "@/styles/sections/IndexSection/components/BalanceViewer/BalanceViewer.module.css";
import { Skeleton, Snippet } from "@nextui-org/react";
import { fetchBalance } from "@wagmi/core";
import { useAtom } from "jotai";
import { FC, useEffect, useState } from "react";
import { Client } from "xrpl";

type Props = {
  evmAddress: `0x${string}`;
  xrplAddress: string;
};
export const BalanceViewer: FC<Props> = ({ evmAddress, xrplAddress }) => {
  const [network, _] = useAtom(networkAtom);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    const fetchMyBalance = async () => {
      setBalance(null);
      try {
        if (network.type === "xrpl") {
          const client = new Client(network.url);
          await client.connect();

          try {
            const balanceString = await client.getXrpBalance(xrplAddress);
            const numBalance = Number(balanceString);
            if (!isNaN(numBalance)) {
              setBalance(numBalance);
            }
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
      } catch (e: any) {
        setBalance(0);
      }
    };

    if (evmAddress || xrplAddress) {
      fetchMyBalance();
    }
  }, [network, evmAddress, xrplAddress]);

  return (
    <div className={styles.container}>
      <Snippet color="primary" symbol="">
        {network.type === "xrpl" ? xrplAddress : evmAddress}
      </Snippet>
      {balance === null ? (
        <Skeleton className={styles["balance-skeleton"]} />
      ) : (
        <div className={styles.balance}>
          {balance} {network.currency}
        </div>
      )}
    </div>
  );
};
