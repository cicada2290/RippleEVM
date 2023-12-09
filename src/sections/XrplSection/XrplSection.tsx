"use client";

import { isAddress } from "ethers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserDetail } from "../components/UserDetail";

export const XrplSection = () => {
  const [evmAddress, setEvmAddress] = useState<
    `0x${string}` | null | undefined
  >(null);

  const params = useParams();
  const xrplAddress = (params?.address ?? null) as string | null;

  useEffect(() => {
    const fetchEvmAddress = async () => {
      if (params && params.address) {
        const response = await fetch(
          `/api/user/evm-address?xrplAddress=${params.address}`,
        );
        if (!response.ok) {
          setEvmAddress(undefined);
          return;
        }

        const json = await response.json();
        if (isAddress(json.data)) {
          setEvmAddress(json.data);
        } else {
          setEvmAddress(undefined);
        }
      }
    };

    fetchEvmAddress();
  }, [params]);

  return <UserDetail evmAddress={evmAddress} xrplAddress={xrplAddress} />;
};
