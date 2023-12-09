import { prisma } from "@/scripts/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { evmAddress, xrplAddress } = req.query;
  if (!evmAddress) {
    return res.status(400).json({ error: "Missing evmAddress" });
  }
  if (!xrplAddress) {
    return res.status(400).json({ error: "Missing xrplAddress" });
  }

  try {
    const data = await prisma.addresses.create({
      data: {
        evm_address: evmAddress as string,
        xrpl_address: xrplAddress as string,
      },
    });

    return res.status(200);
  } catch (e: any) {
    return res.status(500).json({ error: e.message });
  }
}
