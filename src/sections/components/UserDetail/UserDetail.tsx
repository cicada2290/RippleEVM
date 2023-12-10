"use client";

import { ExtendedSkeleton } from "@/components/ExtendedSkeleton";
import { NETWORKS } from "@/data/const/networks";
import { fetchBalances } from "@/scripts/sections/components/UserDetail/fetchBalances";
import { Network } from "@/scripts/types/Network";
import styles from "@/styles/sections/components/UserDetail/UserDetail.module.css";
import {
  Button,
  Card,
  Divider,
  Image,
  Link,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { PaymentModal } from "./components/PaymentModal";

type Props = {
  evmAddress: `0x${string}` | null | undefined;
  xrplAddress: string | null | undefined;
};
export const UserDetail: FC<Props> = ({ evmAddress, xrplAddress }) => {
  const { data: session } = useSession();
  const myEvmAddress = (session as Session)?.user?.evmAddress;
  const myXrplAddress = (session as Session)?.user?.xrplAddress;
  const isMe = (session as Session)?.user?.evmAddress === evmAddress;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [balances, setBalances] = useState<
    {
      network: Network;
      balance: number | null | undefined;
    }[]
  >(
    NETWORKS.map((network) => ({
      network,
      balance: null,
    })),
  );
  const [paymentNetwork, setPaymentNetwork] = useState<Network | null>(null);

  useEffect(() => {
    fetchBalances({ evmAddress, xrplAddress }).then((balances) =>
      setBalances(balances),
    );
  }, [evmAddress, xrplAddress]);

  return (
    <>
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
            {xrplAddress === null ? (
              <ExtendedSkeleton />
            ) : (
              <Link
                href={`https://testnet.xrpl.org/accounts/${xrplAddress}`}
                isExternal={true}
                showAnchorIcon={!!xrplAddress}
                isDisabled={!xrplAddress}
              >
                {xrplAddress || "未登録"}
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
                      {balance.balance === null ? (
                        <Skeleton className={styles["balance-skeleton"]} />
                      ) : (
                        `${balance.balance || 0} ${balance.network.currency}`
                      )}
                    </div>
                  </div>
                  <div>
                    {!isMe && (
                      <Button
                        color="primary"
                        onPress={() => {
                          setPaymentNetwork(balance.network);
                          onOpen();
                        }}
                        isDisabled={!myXrplAddress || !myEvmAddress}
                      >
                        このウォレットに送金
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <PaymentModal
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        network={paymentNetwork}
        user={{ evmAddress, xrplAddress }}
      />
    </>
  );
};
