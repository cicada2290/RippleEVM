import styles from "@/styles/components/Header/Header.module.css";
import { Navbar, NavbarBrand } from "@nextui-org/react";

export const Header = () => {
  return (
    <Navbar isBordered={true}>
      <NavbarBrand>
        <div className={styles.container}>RippleEVM</div>
      </NavbarBrand>
    </Navbar>
  );
};
