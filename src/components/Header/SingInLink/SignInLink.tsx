import { Avatar, Button } from "@nextui-org/react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const SignInLink = () => {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div>
        <Avatar src={session.user?.image ?? undefined} />
      </div>
    );
  }

  return (
    <Link href="/siwe">
      <Button color="primary">ログイン</Button>
    </Link>
  );
};
