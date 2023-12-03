import type { NextApiRequest, NextApiResponse } from "next";
import { Wallet } from "xrpl";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const wallet = Wallet.fromSecret("sEd7bEhHHbovX5rQtUAeXh89QwwbbdU");
  res.status(200).json({ data: wallet.classicAddress });
}
