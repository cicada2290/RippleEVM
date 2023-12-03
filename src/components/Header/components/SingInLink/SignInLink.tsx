import styles from "@/styles/components/Header/components/SignInLink/SignInLink.module.css";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const SignInLink = () => {
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
            onAction={(key) => {
              switch (key) {
                case "delete":
                  signOut();
                  break;
              }
            }}
          >
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
