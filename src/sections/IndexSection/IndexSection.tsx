import { ExtendedSpinner } from "@/components/ExtendedSpinner/ExtendedSpinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { BalanceViewer } from "./components/BalanceViewer";
import { WalletPrompt } from "./components/WalletPrompt";

export const IndexSection = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    router.push("/siwe");
    return <ExtendedSpinner />;
  }

  if (status === "loading" || !session) {
    return <ExtendedSpinner />;
  }

  if (!(session as Session).user.xrplAddress) {
    return <WalletPrompt evmAddress={(session as Session).user.evmAddress} />;
  }

  return (
    <div>
      <BalanceViewer xrplAddress={(session as Session).user.xrplAddress} />
    </div>
  );
};
