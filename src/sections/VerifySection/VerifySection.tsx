"use client";

import { getEvmPublicKey } from "@/scripts/sections/evm/get-evm-public-key";
import { getXrplPublicKey } from "@/scripts/sections/xrpl/get-xrpl-public-key";
import styles from "@/styles/sections/VerifySection/VerifySection.module.css";
import { Button, Input } from "@nextui-org/react";
import { isAddress } from "ethers";
import { useCallback, useState } from "react";
import { isValidAddress } from "xrpl";

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
      const xrplPublicKey = await getXrplPublicKey(xrplAddress);
      if (!xrplPublicKey) {
        setErrorMessage(
          "XRPLウォレットのアドレスが不正か、このアドレスはまだ使われていません",
        );
        setIsVerifying(false);
        return;
      }

      const evmPublicKey = await getEvmPublicKey(evmAddress);
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
