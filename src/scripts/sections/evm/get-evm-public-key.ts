import { NETWORKS } from "@/data/const/networks";
import {
  Transaction as EvmTransaction,
  JsonRpcProvider,
  SigningKey,
} from "ethers";

export const getEvmPublicKey = async (evmAddress: string) => {
  try {
    for (const network of NETWORKS) {
      if (network.type !== "evm") {
        continue;
      }

      const transactionResponse = await fetch(
        `/api/evm/get-transactions?chainId=${network.chainId}&address=${evmAddress}`,
      );
      if (!transactionResponse.ok) {
        continue;
      }

      const transactions = (await transactionResponse.json()).data;
      const provider = new JsonRpcProvider(network.url);
      for (const transaction of transactions) {
        const tx = await provider.getTransaction(transaction.hash);
        if (!tx || tx.from !== evmAddress) {
          continue;
        }

        const txObj = EvmTransaction.from(tx);
        if (!txObj.fromPublicKey) {
          continue;
        }
        return SigningKey.computePublicKey(txObj.fromPublicKey) ?? null;
      }
    }
    return null;
  }catch(e:any){
    console.error(e.message)
    return null;
  }
};
