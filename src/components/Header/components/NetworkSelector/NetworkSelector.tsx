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
        {NETWORKS.filter((n) => n.type === "xrpl").map((network) => (
          <SelectItem key={network.name} value={network.name}>
            {network.name}
          </SelectItem>
        ))}
      </SelectSection>
      <SelectSection title="EVM">
        {NETWORKS.filter((n) => n.type === "evm").map((network) => (
          <SelectItem key={network.name} value={network.name}>
            {network.name}
          </SelectItem>
        ))}
      </SelectSection>
    </Select>
  );
};
