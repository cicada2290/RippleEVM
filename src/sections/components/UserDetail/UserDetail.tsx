"use client";

import { NETWORKS } from "@/data/const/networks";
import { Network } from "@/scripts/types/Network";
import styles from "@/styles/sections/components/UserDetail/UserDetail.module.css";
import { Card, Divider, Image, Link, Skeleton } from "@nextui-org/react";
import { fetchBalance } from "@wagmi/core";
import { FC, useEffect, useState } from "react";
import { Client } from "xrpl";

type Props = {
  evmAddress: `0x${string}` | null;
  xrplAddress: string | null;
};
export const UserDetail: FC<Props> = ({ evmAddress, xrplAddress }) => {
  const [balances, setBalances] = useState<
    { network: Network; balance: number | null }[]
  >(
    NETWORKS.map((network) => ({
      network,
      balance: null,
    })),
  );

  useEffect(() => {
    const fetchBalances = async () => {
      const _balances = await Promise.all(
        NETWORKS.map(async (network) => {
          switch (network.type) {
            case "evm":
              if (evmAddress) {
                const response = await fetchBalance({
                  address: evmAddress,
                  chainId: network.chainId,
                });
                return {
                  network,
                  balance: Number(response.formatted),
                };
              } else {
                return {
                  balance: null,
                  network,
                };
              }
            default:
              if (xrplAddress) {
                const client = new Client(network.url);
                try {
                  await client.connect();
                  const xrplBalance = await client.getXrpBalance(xrplAddress);
                  await client.disconnect();

                  return {
                    balance: Number(xrplBalance),
                    network,
                  };
                } catch (e: any) {
                  return {
                    balance: 0,
                    network,
                  };
                }
              } else {
                return {
                  balance: null,
                  network,
                };
              }
          }
        }),
      );

      setBalances(_balances);
    };

    fetchBalances();
  }, [evmAddress, xrplAddress]);

  return (
    <div className={styles.container}>
      <div className={styles["addresses-container"]}>
        <div className={styles["address-container"]}>
          <Image src="/images/logo/ethereum-eth-logo.svg" alt="Ethereum" />
          <Link
            href={`https://sepolia.etherscan.io/address/${evmAddress}`}
            isExternal={true}
            showAnchorIcon={true}
          >
            {evmAddress}
          </Link>
        </div>
        <div className={styles["address-container"]}>
          <Image src="/images/logo/x.svg" alt="Ethereum" />
          <Link
            href={`https://testnet.xrpl.org/accounts/${xrplAddress}`}
            isExternal={true}
            showAnchorIcon={true}
          >
            {xrplAddress}
          </Link>
        </div>
      </div>
      <Divider />
      <div className={styles["balances-container"]}>
        <Card>
          <div className={styles["balances"]}>
            {balances.map((balance) => (
              <div key={balance.network.name}>
                <div className={styles["network-name"]}>
                  {balance.network.name}
                </div>
                <div>
                  {balance.balance === null ? (
                    <Skeleton className={styles["balance-skeleton"]} />
                  ) : (
                    `${balance.balance} ${balance.network.currency}`
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
