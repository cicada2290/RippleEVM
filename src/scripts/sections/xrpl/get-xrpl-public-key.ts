import { NETWORKS } from "@/data/const/networks";
import { decode, encode } from "ripple-binary-codec";
import { Client } from "xrpl";
import { Transaction as XrplTransaction } from "xrpl/dist/npm/models/transactions/transaction";

export const getXrplPublicKey = async (xrplAddress: string) => {
  for (const network of NETWORKS) {
    if (network.type !== "xrpl") {
      continue;
    }

    const client = new Client(network.url);
    await client.connect();

    const transactions = await client.request({
      command: "account_tx",
      account: xrplAddress,
      ledger_index_min: -1,
      ledger_index_max: -1,
      limit: 100,
    });

    for (const transaction of transactions.result.transactions) {
      const tx = transaction.tx;
      if (tx && tx.Account === xrplAddress) {
        const decoded = decode(encode(tx)) as unknown as XrplTransaction;
        await client.disconnect();

        return decoded.SigningPubKey ?? null;
      }
    }
    await client.disconnect();
  }
  return null;
};
