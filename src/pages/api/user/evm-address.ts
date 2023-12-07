import { supabase } from "@/scripts/supabase/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { xrplAddress } = req.query;
  if (!xrplAddress) {
    return res.status(400).json({ error: "Missing evmAddress" });
  }

  const { data } = await supabase
    .from("addresses")
    .select("evm_address")
    .eq("xrpl_address", xrplAddress)
    .single();
  res.status(200).json({ data: data?.evm_address });
}
