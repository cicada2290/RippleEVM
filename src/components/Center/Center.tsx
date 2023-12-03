import styles from "@/styles/components/Center/Center.module.css";
import { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export const Center: FC<Props> = ({ children }) => {
  return <div className={styles.container}>{children}</div>;
};
