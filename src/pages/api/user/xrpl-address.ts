import { supabase } from "@/scripts/supabase/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { evmAddress } = req.query;
  if (!evmAddress) {
    return res.status(400).json({ error: "Missing evmAddress" });
  }

  const { data } = await supabase
    .from("addresses")
    .select("xrpl_address")
    .eq("evm_address", evmAddress)
    .single();
  res.status(200).json({ data: data?.xrpl_address });
}
