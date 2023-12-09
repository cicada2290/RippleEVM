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
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { Client } from "xrpl";

type Props = {
  evmAddress: `0x${string}` | null | undefined;
  xrplAddress: string | null | undefined;
};
export const UserDetail: FC<Props> = ({ evmAddress, xrplAddress }) => {
  const { data: session } = useSession();

  const [balances, setBalances] = useState<
    { network: Network; balance: number | null | undefined }[]
  >(
    NETWORKS.map((network) => ({
      network,
      balance: null,
    })),
  );

  const handlePayment = async (network: Network) => {
    const { evmAddress: userEvmAddress, xrplAddress: userXrplAddress } = (
      session as Session
    )?.user;
    const privateKeyResponse = await fetch(
      `/api/user/private-key?${
        userEvmAddress
          ? `evmAddress=${userEvmAddress}`
          : `xrplAddress=${userXrplAddress}`
      }`,
    );
    const privateKey = (await privateKeyResponse.json()).data;

    if (network.type === "xrpl") {
      const client = new Client(network.url);
      await client.connect();

      const transaction = {
        TransactionType: "Payment",
        Account: userXrplAddress,
        Amount: "1000000",
        Destination: xrplAddress,
      };
      const prepared = await client.autofill(transaction);
      const signed = client.sign(prepared.txJSON, privateKey);
      const result = await client.submit(signed.signedTransaction);

      await client.disconnect();
    }
  };

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
                  balance: undefined,
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
                  balance: undefined,
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
          {evmAddress === null ? (
            <ExtendedSkeleton />
          ) : (
            <Link
              href={`https://sepolia.etherscan.io/address/${evmAddress}`}
              isExternal={true}
              showAnchorIcon={!!evmAddress}
              isDisabled={!evmAddress}
            >
              {evmAddress || "未登録"}
            </Link>
          )}
        </div>
        <div className={styles["address-container"]}>
          <Image src="/images/logo/x.svg" alt="Ethereum" />
          {
            <Link
              href={`https://testnet.xrpl.org/accounts/${xrplAddress}`}
              isExternal={true}
              showAnchorIcon={!!xrplAddress}
              isDisabled={!xrplAddress}
            >
              {xrplAddress || "未登録"}
            </Link>
          }
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
                    {balance.balance === null ? (
                      <Skeleton className={styles["balance-skeleton"]} />
                    ) : (
                      `${balance.balance || 0} ${balance.network.currency}`
                    )}
                  </div>
                </div>
                <div>
                  <Button
                    color="primary"
                    onPress={() => handlePayment(balance.network)}
                  >
                    送金
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
