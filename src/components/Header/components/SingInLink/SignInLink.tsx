import { networkAtom } from "@/components/atoms";
import styles from "@/styles/components/Header/components/SignInLink/SignInLink.module.css";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  LinkIcon,
} from "@nextui-org/react";
import { useAtom } from "jotai";
import { signOut, useSession } from "next-auth/react";
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
          <DropdownMenu className={styles["dropdown-menu"]}>
            <DropdownItem key="evm">
              <a
                className={styles["dropdown-item"]}
                href={`https://etherscan.io/address/${(session as Session).user
                  ?.evmAddress}`}
                target="_blank"
              >
                <Image
                  src="/images/logo/ethereum-eth-logo.svg"
                  alt="Ethereum"
                />
                <div>
                  {(session as Session).user?.evmAddress}
                  <LinkIcon />
                </div>
              </a>
            </DropdownItem>
            <DropdownItem key="xrpl">
              <a
                className={styles["dropdown-item"]}
                href={path.join(
                  network.explorer,
                  `accounts/${(session as Session).user?.xrplAddress}`,
                )}
                target="_blank"
              >
                <Image src="/images/logo/x.svg" alt="Xrpl" />
                <div className="flex">
                  {(session as Session).user?.xrplAddress}
                  <LinkIcon />
                </div>
              </a>
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              onClick={() => signOut()}
            >
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
