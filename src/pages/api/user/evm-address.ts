import { prisma } from "@/scripts/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { xrplAddress } = req.query;
  if (!xrplAddress) {
    res.status(400).json({ error: "Missing evmAddress" });
    return;
  }

  const data = await prisma.address.findUnique({
    where: { xrpl_address: xrplAddress as string },
    select: { evm_address: true },
  });
  res.status(200).json({ data: data?.evm_address });
}
