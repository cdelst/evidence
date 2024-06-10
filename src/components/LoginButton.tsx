"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

function LoginButton() {
  return (
    <Button
      onClick={() => signIn("github")}
      className="flex items-center justify-center rounded-full bg-white/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20"
    >
      Sign in with GitHub
    </Button>
  );
}

export default LoginButton;
