import { networkAtom } from "@/components/atoms";
import { NETWORKS } from "@/data/const/networks";
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
    const { evmAddress, xrplAddress } = (session as Session).user;

    return (
      <Dropdown>
        <DropdownTrigger>
          <div>
            <Avatar
              className={styles.avatar}
              src={session.user?.image ?? undefined}
              isFocusable={true}
            />
          </div>
        </DropdownTrigger>
        <DropdownMenu
          className={styles["dropdown-menu"]}
          disabledKeys={xrplAddress ? [] : ["xrpl"]}
        >
          <DropdownItem key="evm">
            <a
              className={styles["dropdown-item"]}
              href={path.join(
                network.type === "evm"
                  ? network.explorer || ""
                  : NETWORKS.find((n) => n.type === "evm")!.explorer,
                "address",
                evmAddress,
              )}
              target="_blank"
            >
              <Image src="/images/logo/ethereum-eth-logo.svg" alt="Ethereum" />
              <div>
                {evmAddress}
                <LinkIcon />
              </div>
            </a>
          </DropdownItem>
          <DropdownItem key="xrpl">
            <a
              className={styles["dropdown-item"]}
              href={path.join(
                network.type === "xrpl"
                  ? network.explorer || ""
                  : NETWORKS.find((n) => n.type === "xrpl")!.explorer,
                "accounts",
                xrplAddress || "",
              )}
              target="_blank"
            >
              <Image src="/images/logo/x.svg" alt="Xrpl" />
              <div className="flex">
                {xrplAddress || "未登録"}
                {xrplAddress && <LinkIcon />}
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
