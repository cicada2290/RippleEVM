import styles from "@/styles/components/Header/Header.module.css";
import { Navbar, NavbarBrand, NavbarContent } from "@nextui-org/react";
import { NetworkSelector } from "./NetworkSelector";

export const Header = () => {
  return (
    <Navbar isBordered={true}>
      <NavbarBrand>
        <div className={styles.logo}>RippleEVM</div>
      </NavbarBrand>
      <NavbarContent>
        <NetworkSelector />
      </NavbarContent>
    </Navbar>
  );
};
