import styles from "@/styles/components/ExtendedSpinner/ExtendedSpinner.module.css";
import { Spinner } from "@nextui-org/react";
import { Center } from "../Center";

export const ExtendedSpinner = () => {
  return (
    <div className={styles.container}>
      <Center>
        <Spinner />
      </Center>
    </div>
  );
};
