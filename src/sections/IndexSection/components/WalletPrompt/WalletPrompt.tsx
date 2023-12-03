"use client";

import { networkAtom } from "@/components/atoms";
import styles from "@/styles/sections/IndexSection/components/WalletPrompt/WalletPrompt.module.css";
import { Button, Chip, Input } from "@nextui-org/react";
import { HDNodeWallet, Mnemonic } from "ethers";
import { useAtom } from "jotai";
import { FC, FormEventHandler, useMemo, useState } from "react";
import { Client, Wallet } from "xrpl";

type Props = {
  evmAddress: string;
};
export const WalletPrompt: FC<Props> = ({ evmAddress }) => {
  const router = useRouter();

  const [network, _] = useAtom(networkAtom);

  const [mnemonic, setMnemonic] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [arePrivateKeysEqual, setArePrivateKeysEqual] = useState<
    boolean | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  const isMnemonicInvalid = useMemo(() => {
    if (mnemonic.every((word) => word !== "")) {
      return !Mnemonic.isValidMnemonic(mnemonic.join(" "));
    }

    return false;
  }, [mnemonic]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    const mnemonicString = mnemonic.join(" ");
    const wallet = Wallet.fromMnemonic(mnemonicString, {
      derivationPath: "m/44'/60'/0'/0/0",
    });
    const evmMnemonic = Mnemonic.fromPhrase(mnemonicString);
    const evmWallet = HDNodeWallet.fromMnemonic(evmMnemonic);

    if (
      `0X${wallet.publicKey.toUpperCase()}` !==
      evmWallet.publicKey.toUpperCase()
    ) {
      setArePrivateKeysEqual(false);
    } else {
      try {
        setArePrivateKeysEqual(true);

        setIsLoading(true);

        const client = new Client(network.url);
        await client.connect();
        const fundResponse = await client.fundWallet(wallet);
        if (fundResponse.balance <= 0) {
          throw new Error(
            "XRPLウォレットのアドレスにXRPを送金できませんでした",
          );
        }
        await client.disconnect();

        const addResponse = await fetch(
          `/api/user/add-address?evmAddress=${evmAddress}&xrplAddress=${wallet.address}`,
        );
        if (!addResponse.ok) {
          throw new Error(
            "XRPLウォレットのアドレスをデータベースに追加できませんでした",
          );
        }

        setIsLoading(false);

        router.reload();
      } catch (e: any) {
        console.error(e.message);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div>
        EVMウォレット <Chip>{evmAddress.slice(0, 5)}...</Chip>{" "}
        のリカバリーフレーズを入力してください
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles["mnemonic-inputs"]}>
          {[...Array(12).keys()].map((i) => (
            <Input
              key={i}
              label={i + 1}
              isInvalid={isMnemonicInvalid}
              onChange={(event) => {
                const newMnemonic = [...mnemonic];
                newMnemonic[i] = event.target.value;
                setMnemonic(newMnemonic);

                if (arePrivateKeysEqual === false) {
                  setArePrivateKeysEqual(null);
                }
              }}
            />
          ))}
        </div>
        {isMnemonicInvalid && (
          <div className="text-danger">リカバリーフレーズが不正です</div>
        )}
        {arePrivateKeysEqual === false && (
          <div className="text-danger">
            EVMウォレットとXRPLウォレットの公開鍵が一致しません
          </div>
        )}
        <Button
          isLoading={isLoading}
          type="submit"
          color="primary"
          size="lg"
          isDisabled={
            !mnemonic.every((word) => word !== "") || isMnemonicInvalid
          }
          className={styles["submit-button"]}
        >
          インポート
        </Button>
      </form>
    </div>
  );
};
