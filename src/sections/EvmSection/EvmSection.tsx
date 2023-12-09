"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isValidAddress } from "xrpl";
import { UserDetail } from "../components/UserDetail";

export const EvmSection = () => {
  const [xrplAddress, setXrplAddress] = useState<string | null | undefined>(
    null,
  );

  const params = useParams();
  const evmAddress = (params?.address ?? null) as unknown as
    | `0x${string}`
    | null;

  useEffect(() => {
    const fetchXrplAddress = async () => {
      if (params && params.address) {
        const response = await fetch(
          `/api/user/xrpl-address?evmAddress=${params.address}`,
        );
        if (!response.ok) {
          setXrplAddress(undefined);
          return;
        }

        const json = await response.json();
        if (isValidAddress(json.data)) {
          setXrplAddress(json.data);
        } else {
          setXrplAddress(undefined);
        }
      }
    };

    fetchXrplAddress();
  }, [params]);

  return <UserDetail evmAddress={evmAddress} xrplAddress={xrplAddress} />;
};
