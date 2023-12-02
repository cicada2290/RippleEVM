import styles from "@/styles/components/Header/Header.module.css";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import Link from "next/link";
import { NetworkSelector } from "./NetworkSelector";
import { SignInLink } from "./SingInLink";

export const Header = () => {
  return (
    <Navbar isBordered={true}>
      <NavbarBrand>
        <Link href="/">
          <div className={styles.logo}>RippleEVM</div>
        </Link>
      </NavbarBrand>
      <NavbarContent>
        <NetworkSelector />
        <SignInLink />
      </NavbarContent>
    </Navbar>
  );
};
