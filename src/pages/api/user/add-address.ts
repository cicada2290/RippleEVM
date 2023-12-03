import { supabase } from "@/scripts/supabase/client";
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

  const { error } = await supabase
    .from("addresses")
    .insert([{ evm_address: evmAddress, xrpl_address: xrplAddress }]);

  if (error) {
    return res.status(500).json({ error });
  } else {
    return res.status(200).json({ data: xrplAddress });
  }
}
