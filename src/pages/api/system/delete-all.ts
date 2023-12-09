import { prisma } from "@/scripts/prisma/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await prisma.address.deleteMany();
  await prisma.secret.deleteMany();

  res.status(200).json({ data: "ok" });
}
