"use client";

import { networkAtom } from "@/components/atoms";
import { useAtom } from "jotai";
import { useSession } from "next-auth/react";
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

  return <div>{balance}</div>;
};
