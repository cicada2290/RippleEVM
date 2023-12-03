import { networkAtom } from "@/components/atoms";
import styles from "@/styles/components/Header/components/SignInLink/SignInLink.module.css";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  LinkIcon,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import path from "path";

export const SignInLink = () => {
  const [network, _] = useAtom(networkAtom);

  const { data: session, status } = useSession();

  if (session?.user) {
    return (
      <div>
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              className={styles.avatar}
              src={session.user?.image ?? undefined}
              isFocusable={true}
            />
          </DropdownTrigger>
          <DropdownMenu
            className={styles["dropdown-menu"]}
            onAction={(key) => {
              switch (key) {
                case "delete":
                  signOut();
                  break;
              }
            }}
          >
            <DropdownItem
              key="evm"
              href={`https://etherscan.io/address/${(session as Session).user
                ?.evmAddress}`}
            >
              <div className={styles["dropdown-item"]}>
                <div>
                  <Image
                    src="images/logo/ethereum-eth-logo.svg"
                    alt="Ethereum"
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  {(session as Session).user?.evmAddress}
                  <LinkIcon />
                </div>
              </div>
            </DropdownItem>
            <DropdownItem
              key="xrpl"
              href={path.join(
                network.explorer,
                `accounts/${(session as Session).user?.xrplAddress}`,
              )}
            >
              <div className={styles["dropdown-item"]}>
                <div>
                  <Image
                    src="images/logo/x.svg"
                    alt="Xrpl"
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex">
                  {(session as Session).user?.xrplAddress}
                  <LinkIcon />
                </div>
              </div>
            </DropdownItem>
            <DropdownItem key="delete" className="text-danger" color="danger">
              ログアウト
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }

  return (
    <Link href="/siwe">
      <Button isLoading={status === "loading"} color="primary">
        ログイン
      </Button>
    </Link>
  );
};
