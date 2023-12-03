import { networkAtom } from "@/components/atoms";
import { NETWORKS } from "@/data/const/networks";
import { Select, SelectItem, SelectSection } from "@nextui-org/react";
import { useAtom } from "jotai";

export const NetworkSelector = () => {
  const [network, setNetwork] = useAtom(networkAtom);

  return (
    <Select
      color="primary"
      labelPlacement="outside-left"
      selectedKeys={[network.name]}
      onChange={(e) =>
        setNetwork(NETWORKS.find((n) => n.name === e.target.value)!)
      }
    >
      <SelectSection title="XRPL">
        {NETWORKS.map((network) => (
          <SelectItem key={network.name} value={network.name}>
            {network.name}
          </SelectItem>
        ))}
      </SelectSection>
    </Select>
  );
};
