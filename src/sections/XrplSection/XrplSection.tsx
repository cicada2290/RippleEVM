"use client";

import { ExtendedSpinner } from "@/components/ExtendedSpinner/ExtendedSpinner";
import { NETWORKS } from "@/data/const/networks";
import { Balance } from "@/scripts/types/Balance";
import { isAddress } from "ethers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Client } from "xrpl";
import { UserDetail } from "../components/UserDetail/UserDetail";

export const XrplSection = () => {
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);

  const params = useParams();
  const xrplAddress = params?.address as unknown as string;

  useEffect(() => {
    const fetchEvmAddress = async () => {
      if (params && params.address) {
        const response = await fetch(
          `/api/user/evm-address?xrplAddress=${params.address}`,
        );
        if (!response.ok) {
          setEvmAddress("");
          return;
        }

        const json = await response.json();
        if (isAddress(json.data)) {
          setEvmAddress(json.data);
        } else {
          setEvmAddress("");
        }
      }
    };

    fetchEvmAddress();
  }, [params]);

  useEffect(() => {
    const fetchBalances = async () => {
      if (evmAddress && xrplAddress) {
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
  }, [evmAddress, xrplAddress]);

  if (!params || !xrplAddress) {
    return <ExtendedSpinner />;
  }

  return (
    <UserDetail
      evmAddress={evmAddress}
      xrplAddress={xrplAddress}
      balances={balances}
    />
  );
};
