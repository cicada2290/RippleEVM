"use client";

import { NETWORKS } from "@/data/const/networks";
import styles from "@/styles/sections/VerifySection/VerifySection.module.css";
import { Button, Input } from "@nextui-org/react";
import {
  Transaction as EvmTransaction,
  JsonRpcProvider,
  SigningKey,
  isAddress,
} from "ethers";
import { useCallback, useState } from "react";
import { decode, encode } from "ripple-binary-codec";
import { Client, Transaction as XrplTransaction, isValidAddress } from "xrpl";

export const VerifySection = () => {
  const [xrplAddress, setXrplAddress] = useState("");
  const [evmAddress, setEvmAddress] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string>("");

  const isXrplAddressInvalid = useCallback(() => {
    if (xrplAddress === "") {
      return false;
    }
    return !isValidAddress(xrplAddress);
  }, [xrplAddress]);
  const isEvmAddressInvalid = useCallback(() => {
    if (evmAddress === "") {
      return false;
    }
    return !isAddress(evmAddress);
  }, [evmAddress]);

  const handleVerify = async () => {
    setIsVerifying(true);
    setErrorMessage("");

    try {
      let xrplPublicKey;
      for (const network of NETWORKS) {
        if (network.type !== "xrpl") {
          continue;
        }

        const client = new Client(network.url);
        await client.connect();

        const transactions = await client.request({
          command: "account_tx",
          account: xrplAddress,
          ledger_index_min: -1,
          ledger_index_max: -1,
          limit: 100,
        });

        for (const transaction of transactions.result.transactions) {
          const tx = transaction.tx;
          if (tx && tx.Account === xrplAddress) {
            const decoded = decode(encode(tx)) as unknown as XrplTransaction;
            xrplPublicKey = decoded.SigningPubKey;

            await client.disconnect();

            break;
          }
        }

        await client.disconnect();
      }
      if (!xrplPublicKey) {
        setErrorMessage(
          "XRPLウォレットのアドレスが不正か、このアドレスはまだ使われていません",
        );
        setIsVerifying(false);
        return;
      }

      let evmPublicKey;
      for (const network of NETWORKS) {
        if (network.type !== "evm") {
          continue;
        }

        const transactionResponse = await fetch(
          `/api/evm/get-transactions?chainId=${network.chainId}&address=${evmAddress}`,
        );
        if (!transactionResponse.ok) {
          continue;
        }

        const transactions = (await transactionResponse.json()).data;
        const provider = new JsonRpcProvider(network.url);
        for (const transaction of transactions) {
          const tx = await provider.getTransaction(transaction.hash);
          if (!tx || tx.from !== evmAddress) {
            continue;
          }

          const txObj = EvmTransaction.from(tx);
          if (!txObj.fromPublicKey) {
            continue;
          }
          evmPublicKey = SigningKey.computePublicKey(txObj.fromPublicKey);
          break;
        }
      }
      if (!evmPublicKey) {
        setErrorMessage(
          "EVMウォレットのアドレスが不正か、このアドレスはまだ使われていません",
        );
        setIsVerifying(false);
        return;
      }

      if (
        xrplPublicKey.toLowerCase() === evmPublicKey?.slice(2).toLowerCase()
      ) {
        setResultMessage("ウォレットの所有者は同じです");
      } else {
        setResultMessage("ウォレットの所有者が異なります");
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    }

    setIsVerifying(false);
  };

  return (
    <div className={styles.container}>
      <div>XRPLとEVMのウォレットの所有者が同じかどうか調べることができます</div>
      <div className={styles.form}>
        <Input
          label="XRPLウォレットのアドレス"
          isInvalid={isXrplAddressInvalid()}
          errorMessage={
            isXrplAddressInvalid() && "XRPLウォレットのアドレスが不正です"
          }
          value={xrplAddress}
          onChange={(event) => setXrplAddress(event.target.value)}
        />
        <Input
          label="EVMウォレットのアドレス"
          value={evmAddress}
          errorMessage={
            isEvmAddressInvalid() && "EVMウォレットのアドレスが不正です"
          }
          isInvalid={isEvmAddressInvalid()}
          onChange={(event) => setEvmAddress(event.target.value)}
        />
        {errorMessage && <div className={"text-danger"}>{errorMessage}</div>}
        {resultMessage && <div className={"text-success"}>{resultMessage}</div>}
        <Button
          color="primary"
          size="lg"
          isDisabled={
            isXrplAddressInvalid() ||
            isEvmAddressInvalid() ||
            xrplAddress === "" ||
            evmAddress === ""
          }
          isLoading={isVerifying}
          onPress={handleVerify}
        >
          調べる
        </Button>
      </div>
    </div>
  );
};
