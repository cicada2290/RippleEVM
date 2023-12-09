import { prisma } from "@/scripts/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { evmAddress, xrplAddress } = req.query;
  if (!evmAddress && !xrplAddress) {
    res.status(400).json({
      error: "evmAddressパラメーターかxrplAddressパラメーターは必須です",
    });
    return;
  }

  let data;
  if (evmAddress) {
    data = await prisma.secret.findUnique({
      where: { evm_address: evmAddress as string },
      select: { private_key: true },
    });
  } else {
    data = await prisma.secret.findUnique({
      where: { xrpl_address: xrplAddress as string },
      select: { private_key: true },
    });
  }
  res.status(200).json({ data: data?.private_key });
}
