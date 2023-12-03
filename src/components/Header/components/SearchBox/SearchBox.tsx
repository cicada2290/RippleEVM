import styles from "@/styles/components/Header/components/SearchBox/SearchBox.module.css";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Input } from "@nextui-org/react";
import { isAddress } from "ethers";
import { useRouter } from "next/navigation";
import { ChangeEventHandler } from "react";
import { isValidAddress } from "xrpl";

export const SearchBox = () => {
  const router = useRouter();

  const handleChange: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const { value } = event.target;

    if (isAddress(value)) {
      router.push(`/evm/${value}`);
    } else if (isValidAddress(value)) {
      router.push(`/xrpl/${value}`);
    }
  };

  return (
    <Input
      color="primary"
      variant="faded"
      labelPlacement="outside-left"
      endContent={<MagnifyingGlassIcon className={styles.icon} />}
      onChange={handleChange}
    />
  );
};
