import { NETWORKS } from "@/data/const/networks";
import { prisma } from "@/scripts/prisma/prisma";
import { HDNodeWallet, Mnemonic, isAddress } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import { Client, Wallet as XrplWallet } from "xrpl";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { mnemonic, evmAddress: givenEvmAddress } = req.query;
  if (!mnemonic) {
    res.status(400).json({ error: "mnemonicパラメーターがありません" });
    return;
  }
  if (Array.isArray(mnemonic) || !Mnemonic.isValidMnemonic(mnemonic)) {
    res.status(400).json({ error: "mnemonicパラメーターが不正です" });
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
    let evmWallet = undefined;
    let xrplWallet = undefined;
    for (let i = 0; i < 100; i++) {
      const derivationPath = `m/44'/60'/0'/0/${i}`;
      const evmMnemonic = Mnemonic.fromPhrase(mnemonic);
      const _evmWallet = HDNodeWallet.fromMnemonic(evmMnemonic, derivationPath);
      const _xrplWallet = XrplWallet.fromMnemonic(mnemonic, {
        derivationPath,
      });

      if (_evmWallet.address === givenEvmAddress) {
        evmWallet = _evmWallet;
        xrplWallet = _xrplWallet;
        break;
      }
    }
    if (!evmWallet || !xrplWallet) {
      res.status(400).json({ error: "evmAddressが不正です" });
      return;
    }
    if (
      evmWallet.publicKey.slice(2).toLowerCase() !==
      xrplWallet.publicKey.toLowerCase()
    ) {
      res.status(400).json({ error: "evmAddressが不正です" });
      return;
    }

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

    await prisma.secret.create({
      data: {
        evm_address: evmAddress,
        xrpl_address: xrplAddress,
        public_key: xrplWallet.publicKey,
        private_key: xrplWallet.privateKey,
      },
    });

    await prisma.address.create({
      data: {
        evm_address: evmAddress,
        xrpl_address: xrplAddress,
      },
    });

    res.status(200).json({ data: { xrplAddress, evmAddress } });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
