import { prisma } from "@/scripts/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { evmAddress } = req.query;
  if (!evmAddress) {
    res.status(400).json({ error: "Missing evmAddress" });
    return;
  }

  try {
    const data = await prisma.address.findUnique({
      where: {evm_address: evmAddress as string},
      select: {xrpl_address: true},
    });
    res.status(200).json({data: data?.xrpl_address});
  } catch (e) {
    res.status(200).json({data: null});
  }
}
