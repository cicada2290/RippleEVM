import { prisma } from "@/scripts/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { evmAddress } = req.query;
  if (!evmAddress) {
    return res.status(400).json({ error: "Missing evmAddress" });
  }

  const data = await prisma.addresses.findUnique({
    where: { evm_address: evmAddress as string },
    select: { xrpl_address: true },
  });
  res.status(200).json({ data: data?.xrpl_address });
}
