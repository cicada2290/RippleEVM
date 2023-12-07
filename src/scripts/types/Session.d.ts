import { DefaultSession } from "next-auth";

declare global {
  type Session = DefaultSession & {
    user: {
      evmAddress: `0x${string}`;
      xrplAddress: string;
    };
  };
}
