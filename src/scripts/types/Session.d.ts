import { DefaultSession } from "next-auth";

declare global {
  type Session = DefaultSession & {
    user: {
      evmAddress: string;
      xrplAddress: string;
    };
  };
}
