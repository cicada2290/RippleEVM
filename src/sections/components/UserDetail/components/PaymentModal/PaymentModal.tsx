"use client";

import { ExtendedSpinner } from "@/components/ExtendedSpinner";
import { Network } from "@/scripts/types/Network";
import styles from "@/styles/sections/components/UserDetail/components/PaymentModal/PaymentModal.module.css";
import {
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
} from "@nextui-org/react";
import { fetchBalance } from "@wagmi/core";
import { Wallet, parseEther } from "ethers";
import { JsonRpcProvider } from "ethers/providers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import path from "path";
import { FC, useEffect, useState } from "react";
import { Client, Wallet as XrplWallet, xrpToDrops } from "xrpl";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (open: boolean) => void;
  network: Network | null;
  user: {
    evmAddress: `0x${string}` | null | undefined;
    xrplAddress: string | null | undefined;
  };
};
export const PaymentModal: FC<Props> = ({
  isOpen,
  onOpen,
  onOpenChange,
  network,
  user,
}) => {
  const router = useRouter();

  const { evmAddress, xrplAddress } = user;

  const { data: session } = useSession();
  const myEvmAddress = (session as Session)?.user?.evmAddress;
  const myXrplAddress = (session as Session)?.user?.xrplAddress;

  const [amount, setAmount] = useState<string>("0");
  const [myBalance, setMyBalance] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);

  const isInvalid =
    !myBalance ||
    isNaN(Number(amount)) ||
    Number(amount) < 0 ||
    Number(amount) > myBalance;

  const handlePayment = async (onClose: () => void) => {
    if (!network) {
      return;
    }

    setIsSending(true);

    const privateKeyResponse = await fetch(
      `/api/user/key-pairs?${
        myEvmAddress
          ? `evmAddress=${myEvmAddress}`
          : `xrplAddress=${myXrplAddress}`
      }`,
    );
    const { private_key: privateKey, public_key: publicKey } = (
      await privateKeyResponse.json()
    ).data;

    if (network.type === "xrpl") {
      if (!xrplAddress) {
        return;
      }

      const wallet = new XrplWallet(publicKey, privateKey);
      const client = new Client(network.url);
      await client.connect();

      const prepared = await client.autofill({
        TransactionType: "Payment",
        Account: myXrplAddress,
        Amount: xrpToDrops(amount),
        Destination: xrplAddress,
      });
      const signed = wallet.sign(prepared);
      const tx = await client.submitAndWait(signed.tx_blob);

      await client.disconnect();

      window.open(
        path.join(network.explorer, "transactions", tx.result.hash),
        "_blank",
      );
    } else {
      if (!evmAddress) {
        return;
      }

      const provider = new JsonRpcProvider(network.rpc);
      const wallet = new Wallet(`0x${privateKey.slice(2)}`, provider);
      const tx = await wallet.sendTransaction({
        to: evmAddress,
        value: parseEther(amount),
      });

      window.open(path.join(network.explorer, "tx", tx.hash), "_blank");
    }

    setIsSending(false);
  };

  useEffect(() => {
    const fetchMyBalance = async () => {
      setMyBalance(null);

      if (!network) {
        return;
      }

      let myBalanceString;
      if (network.type === "xrpl") {
        const client = new Client(network.url);
        await client.connect();

        myBalanceString = await client.getXrpBalance(myXrplAddress);

        await client.disconnect();
      } else {
        const myBalanceResponse = await fetchBalance({
          address: myEvmAddress,
          chainId: network.chainId,
        });
        myBalanceString = myBalanceResponse.formatted;
      }

      const numMyBalance = Number(myBalanceString);
      if (!isNaN(numMyBalance)) {
        setMyBalance(numMyBalance);
      }
    };

    setAmount("0");
    setIsSending(false);
    fetchMyBalance();
  }, [myEvmAddress, myXrplAddress, network]);

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>送金@{network?.name}</ModalHeader>
            <ModalBody>
              {network === null ? (
                <ExtendedSpinner />
              ) : (
                <>
                  <Chip>
                    {network.type === "xrpl" ? myXrplAddress : myEvmAddress}
                  </Chip>
                  <div>
                    {myBalance === null ? (
                      <Skeleton className={styles["balance-skeleton"]} />
                    ) : (
                      `${myBalance} ${network.currency}`
                    )}
                  </div>
                  <Input
                    label="送金額"
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue = Number(value);
                      setAmount(
                        value.includes(".") || isNaN(numValue)
                          ? value
                          : Number(value).toString(),
                      );
                    }}
                    value={amount?.toString()}
                    isInvalid={isInvalid}
                    endContent={network.currency}
                  />
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onPress={onClose}>
                拒否
              </Button>
              <Button
                color="primary"
                isDisabled={isInvalid || Number(amount) <= 0}
                onPress={() => handlePayment(onClose)}
                isLoading={isSending}
              >
                承認
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
