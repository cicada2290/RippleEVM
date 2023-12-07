"use client";

import { ExtendedSkeleton } from "@/components/ExtendedSkeleton";
import { NETWORKS } from "@/data/const/networks";
import { Balance } from "@/scripts/types/Balance";
import styles from "@/styles/sections/components/UserDetail/UserDetail.module.css";
import { Card, Divider, Image } from "@nextui-org/react";
import { fetchBalance } from "@wagmi/core";
import { FC, useEffect, useState } from "react";
import { Client } from "xrpl";

type Props = {
  evmAddress: `0x${string}` | null;
  xrplAddress: string | null;
};
export const UserDetail: FC<Props> = ({ evmAddress, xrplAddress }) => {
  const [balances, setBalances] = useState<Balance[]>([]);

  useEffect(() => {
    const fetchBalances = async () => {
      const _balances = [] as Balance[];

      for (const network of NETWORKS) {
        switch (network.type) {
          case "evm":
            if (evmAddress) {
              const response = await fetchBalance({
                address: evmAddress,
                chainId: network.chainId,
              });
              _balances.push({
                balance: Number(response.formatted),
                currency: "ETH",
                networkName: network.name,
              });
            }
            break;
          case "xrpl":
            if (xrplAddress) {
              const client = new Client(network.url);
              try {
                const balance = await client.getXrpBalance(xrplAddress);
                _balances.push({
                  balance: Number(balance),
                  currency: "XRP",
                  networkName: network.name,
                });
              } catch (e: any) {
                _balances.push({
                  balance: 0,
                  currency: "XRP",
                  networkName: network.name,
                });
              }
            }
            break;
        }
      }

      setBalances(_balances);
    };

    fetchBalances();
  }, [evmAddress, xrplAddress]);

  return (
    <div className={styles.container}>
      <div className={styles["addresses-container"]}>
        <div className={styles["address-container"]}>
          <div>
            <Image src="/images/logo/ethereum-eth-logo.svg" alt="Ethereum" />
          </div>
          <div>{evmAddress || <ExtendedSkeleton />}</div>
        </div>
        <div className={styles["address-container"]}>
          <div>
            <Image src="/images/logo/x.svg" alt="Ethereum" />
          </div>
          {xrplAddress || <ExtendedSkeleton />}
        </div>
      </div>
      <Divider />
      <div className={styles["balances-container"]}>
        <Card>
          <div className={styles["balances"]}>
            {balances.map((balance) => (
              <div key={balance.networkName}>
                <div className={styles["network-name"]}>
                  {balance.networkName}
                </div>
                <div>
                  {balance.balance || 0} {balance.currency}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
