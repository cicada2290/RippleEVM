import { ExtendedSkeleton } from "@/components/ExtendedSkeleton";
import { Balance } from "@/scripts/types/Balance";
import styles from "@/styles/sections/components/UserDetail/UserDetail.module.css";
import { Card, Divider, Image } from "@nextui-org/react";
import { FC } from "react";

type Props = {
  evmAddress: string | null;
  xrplAddress: string | null;
  balances: Balance[];
};
export const UserDetail: FC<Props> = ({
  evmAddress,
  xrplAddress,
  balances,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles["addresses-container"]}>
        <div className={styles["address-container"]}>
          <div>
            <Image src="/images/logo/ethereum-eth-logo.svg" alt="Ethereum" />
          </div>
          <div>{evmAddress || <ExtendedSkeleton />}</div>
        </div>
        <div className={styles["address-container"]}>
          <div>
            <Image src="/images/logo/x.svg" alt="Ethereum" />
          </div>
          {xrplAddress || <ExtendedSkeleton />}
        </div>
      </div>
      <Divider />
      <div className={styles["balances-container"]}>
        <Card>
          <div className={styles["balances"]}>
            {balances.map((balance) => (
              <div key={balance.networkName}>
                <div className={styles["network-name"]}>
                  {balance.networkName}
                </div>
                <div>
                  {balance.balance || 0} {balance.currency}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
