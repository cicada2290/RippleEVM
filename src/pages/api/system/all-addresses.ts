import { prisma } from "@/scripts/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const data = await prisma.address.findMany();
  res.status(200).json({ data });
}
