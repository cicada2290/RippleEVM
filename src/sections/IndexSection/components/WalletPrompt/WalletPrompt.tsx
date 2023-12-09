"use client";

import styles from "@/styles/sections/IndexSection/components/WalletPrompt/WalletPrompt.module.css";
import { Button, Chip, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FC, FormEventHandler, useState } from "react";

type Props = {
  evmAddress: string;
};
export const WalletPrompt: FC<Props> = ({ evmAddress }) => {
  const router = useRouter();

  const [privateKey, setPrivateKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    const response = await fetch(
      `api/user/generate-wallets?privateKey=${privateKey}&evmAddress=${evmAddress}`,
    );
    const json = await response.json();
    if (json.error) {
      setError(json.error);
    }

    setIsLoading(false);

    router.refresh();
  };

  return (
    <div className={styles.container}>
      <div>
        EVMウォレット <Chip>{evmAddress.slice(0, 5)}...</Chip>{" "}
        の秘密鍵を入力してください
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles["private-key-input"]}>
          <Input
            label="秘密鍵"
            isInvalid={!!error}
            onChange={(event) => {
              setPrivateKey(event.target.value);
            }}
          />
        </div>
        {error && <div className="text-danger">{error}</div>}
        <Button
          isLoading={isLoading}
          type="submit"
          color="primary"
          size="lg"
          isDisabled={privateKey.length !== 64 || isLoading}
          className={styles["submit-button"]}
        >
          インポート
        </Button>
      </form>
    </div>
  );
};
