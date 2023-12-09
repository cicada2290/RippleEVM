import { NETWORKS } from "@/data/const/networks";
import { prisma } from "@/scripts/prisma/prisma";
import { Wallet as EvmWallet, isAddress } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import secp256k1 from "secp256k1";
import { Client, Wallet as XrplWallet } from "xrpl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { privateKey, evmAddress: givenEvmAddress } = req.query;
  if (!privateKey) {
    res.status(400).json({ error: "privateKeyパラメーターがありません" });
    return;
  }
  if (Array.isArray(privateKey)) {
    res.status(400).json({ error: "privateKeyパラメーターが不正です" });
    return;
  }
  if (!givenEvmAddress) {
    res.status(400).json({ error: "evmAddressパラメーターがありません" });
    return;
  }
  if (Array.isArray(givenEvmAddress) || !isAddress(givenEvmAddress)) {
    res.status(400).json({ error: "evmAddressパラメーターが不正です" });
    return;
  }

  try {
    const evmWallet = new EvmWallet(privateKey);
    const publicKey = Array.from(
      secp256k1.publicKeyCreate(
        Buffer.from(evmWallet.privateKey.slice(2), "hex"),
        false,
      ),
    )
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const xrplWallet = new XrplWallet(publicKey, privateKey);

    const xrplAddress = xrplWallet.address;
    const evmAddress = evmWallet.address;

    if (evmAddress !== givenEvmAddress) {
      res.status(400).json({ error: "evmAddressが不正です" });
      return;
    }

    for (const network of NETWORKS) {
      if (network.type !== "xrpl") {
        continue;
      }

      try {
        const client = new Client(network.url);
        await client.connect();
        await client.fundWallet(xrplWallet);
        await client.disconnect();
      } catch (e: any) {
        console.error(e.message);
      }
    }

    await prisma.address.create({
      data: {
        evm_address: evmAddress,
        xrpl_address: xrplAddress,
      },
    });
    await prisma.secret.create({
      data: {
        evm_address: evmAddress,
        xrpl_address: xrplAddress,
        private_key: privateKey,
      },
    });

    res.status(200).json({ data: { xrplAddress, evmAddress } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
