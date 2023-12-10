import styles from "@/styles/components/Header/Header.module.css";
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import NextLink from "next/link";
import { NetworkSelector } from "./components/NetworkSelector";
import { SearchBox } from "./components/SearchBox";
import { SignInLink } from "./components/SingInLink";

export const Header = () => {
  return (
    <Navbar isBordered={true}>
      <NavbarBrand>
        <NextLink href="/">
          <div className={styles.logo}>RippleEVM</div>
        </NextLink>
      </NavbarBrand>
      <NavbarContent>
        <NavbarItem>
          <Link href="/verify">XRPL/EVM認証</Link>
        </NavbarItem>
        <SearchBox />
        <NetworkSelector />
        <SignInLink />
      </NavbarContent>
    </Navbar>
  );
};
