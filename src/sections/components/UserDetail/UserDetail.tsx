"use client";

import { ExtendedSkeleton } from "@/components/ExtendedSkeleton";
import { NETWORKS } from "@/data/const/networks";
import { Network } from "@/scripts/types/Network";
import styles from "@/styles/sections/components/UserDetail/UserDetail.module.css";
import {
  Button,
  Card,
  Divider,
  Image,
  Link,
  Skeleton,
} from "@nextui-org/react";
import { fetchBalance } from "@wagmi/core";
import { FC, useEffect, useState } from "react";
import { Client } from "xrpl";

type Props = {
  evmAddress: `0x${string}` | null | undefined;
  xrplAddress: string | null | undefined;
};
export const UserDetail: FC<Props> = ({ evmAddress, xrplAddress }) => {
  const [balances, setBalances] = useState<
    { network: Network; balance: number | null; isUndefined: boolean }[]
  >(
    NETWORKS.map((network) => ({
      network,
      balance: null,
      isUndefined:
        (evmAddress === undefined && network.type === "evm") ||
        (xrplAddress === undefined && network.type === "xrpl"),
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
                  isUndefined: false,
                };
              } else {
                return {
                  balance: null,
                  network,
                  isUndefined: true,
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
                    isUndefined: false,
                  };
                } catch (e: any) {
                  return {
                    balance: 0,
                    network,
                    isUndefined: false,
                  };
                }
              } else {
                return {
                  balance: null,
                  network,
                  isUndefined: true,
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
          {evmAddress === undefined ? (
            <>未登録</>
          ) : evmAddress === null ? (
            <ExtendedSkeleton />
          ) : (
            <Link
              href={`https://sepolia.etherscan.io/address/${evmAddress}`}
              isExternal={true}
              showAnchorIcon={true}
            >
              {evmAddress}
            </Link>
          )}
        </div>
        <div className={styles["address-container"]}>
          <Image src="/images/logo/x.svg" alt="Ethereum" />
          {xrplAddress === undefined ? (
            <>未登録</>
          ) : xrplAddress === null ? (
            <ExtendedSkeleton />
          ) : (
            <Link
              href={`https://testnet.xrpl.org/accounts/${xrplAddress}`}
              isExternal={true}
              showAnchorIcon={true}
            >
              {xrplAddress}
            </Link>
          )}
        </div>
      </div>
      <Divider />
      <div className={styles["balances-container"]}>
        <Card>
          <div className={styles["balances"]}>
            {balances.map((balance) => (
              <div
                key={balance.network.name}
                className={styles["balance-container"]}
              >
                <div>
                  <div className={styles["network-name"]}>
                    {balance.network.name}
                  </div>
                  <div>
                    {balance.isUndefined ? (
                      <>未登録</>
                    ) : balance.balance === null ? (
                      <Skeleton className={styles["balance-skeleton"]} />
                    ) : (
                      `${balance.balance} ${balance.network.currency}`
                    )}
                  </div>
                </div>
                <div>
                  <Button onPress={async () => {}}>送金</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};