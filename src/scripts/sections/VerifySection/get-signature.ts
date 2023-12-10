export const getSignature = ({
  r,
  s,
  v,
}: {
  r: string;
  s: string;
  v: number;
}) => {
  const rHex = BigInt(r).toString(16);
  const sHex = BigInt(s).toString(16);

  return `0x${rHex}${sHex}`;
};
