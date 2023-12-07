"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isValidAddress } from "xrpl";
import { UserDetail } from "../components/UserDetail/UserDetail";

export const EvmSection = () => {
  const [xrplAddress, setXrplAddress] = useState<string | null>(null);

  const params = useParams();
  const evmAddress = params?.address as unknown as string;

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

  return <UserDetail evmAddress={evmAddress} xrplAddress={xrplAddress} />;
};
