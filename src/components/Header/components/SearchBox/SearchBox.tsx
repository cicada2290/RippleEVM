import styles from "@/styles/components/Header/components/SearchBox/SearchBox.module.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Input } from "@nextui-org/react";

export const SearchBox = () => {
  return (
    <Input
      color="primary"
      variant="faded"
      labelPlacement="outside-left"
      endContent={<MagnifyingGlassIcon className={styles.icon} />}
    />
  );
};
