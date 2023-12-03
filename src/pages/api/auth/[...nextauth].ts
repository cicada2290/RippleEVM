import { SupabaseAdapter } from "@auth/supabase-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import path from "path";
import { SiweMessage } from "siwe";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || "{}"),
          );
          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);

          const nonce = await getCsrfToken({ req: { headers: req.headers } });
          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce,
          });

          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth.includes("signin");

  // Hide Sign-In with Ethereum from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  const auth = await NextAuth(req, res, {
    // https://next-auth.js.org/configuration/providers/oauth
    adapter: SupabaseAdapter({
      url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    }),
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.user.evmAddress = token.sub;
        session.user.xrplAddress = await fetch(
          path.join(process.env.NEXTAUTH_URL!, "api/user/xrpl-wallet"),
        )
          .then((r) => r.json())
          .then((r) => r.data);
        session.user.name = token.sub;
        return session;
      },
    },
  });
  return auth;
}
