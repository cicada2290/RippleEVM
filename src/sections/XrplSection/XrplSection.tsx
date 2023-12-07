"use client";

import { isAddress } from "ethers";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserDetail } from "../components/UserDetail/UserDetail";

export const XrplSection = () => {
  const [evmAddress, setEvmAddress] = useState<string | null>(null);

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

  return <UserDetail evmAddress={evmAddress} xrplAddress={xrplAddress} />;
};
