"use client";

import { ExtendedSpinner } from "@/components/ExtendedSpinner/ExtendedSpinner";
import { NETWORKS } from "@/data/const/networks";
import { Balance } from "@/scripts/types/Balance";
import styles from "@/styles/sections/EvmSection/EvmSection.module.css";
import { Card, Divider, Skeleton } from "@nextui-org/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Client, isValidAddress } from "xrpl";

export const EvmSection = () => {
  const [xrplAddress, setXrplAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);

  const params = useParams();

  useEffect(() => {
    const fetchXrplAddress = async () => {
      if (params && params.address) {
        const response = await fetch(
          `/api/user/xrpl-address?evmAddress=${params.address}`,
        );
        if (!response.ok) {
          setXrplAddress("");
          return;
        }

        const json = await response.json();
        if (isValidAddress(json.data)) {
          setXrplAddress(json.data);
        } else {
          setXrplAddress("");
        }
      }
    };

    fetchXrplAddress();
  }, [params]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (xrplAddress) {
        const _balances = [] as Balance[];

        for (const network of NETWORKS) {
          switch (network.type) {
            case "evm":
              _balances.push({
                balance: 0,
                currency: "ETH",
                networkName: network.name,
              });
              break;
            case "xrpl":
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
              break;
          }
        }

        setBalances(_balances);
      }
    };

    fetchBalances();
  }, [xrplAddress]);

  if (!params || !params.address) {
    return <ExtendedSpinner />;
  }

  return (
    <div className={styles.container}>
      <div className={styles["addresses-container"]}>
        <div className={styles["address-container"]}>
          <div>
            <Image
              src="/images/logo/ethereum-eth-logo.svg"
              alt="Ethereum"
              width={32}
              height={32}
            />
          </div>
          <div>{params.address}</div>
        </div>
        <div className={styles["address-container"]}>
          <div>
            <Image
              src="/images/logo/x.svg"
              alt="Ethereum"
              width={32}
              height={32}
            />
          </div>
          {xrplAddress || <Skeleton />}
        </div>
      </div>
      <Divider />
      <div className={styles["balances-container"]}>
        <Card>
          <div className={styles["balances"]}>
            {balances.length > 0 ? (
              balances.map((balance) => (
                <div key={balance.networkName}>
                  <div className={styles["network-name"]}>
                    {balance.networkName}
                  </div>
                  <div>
                    {balance.balance} {balance.currency}
                  </div>
                </div>
              ))
            ) : (
              <Skeleton />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
