"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

function LougoutButton() {
  return (
    <Button
      onClick={() => signOut()}
      className="flex items-center justify-center rounded-full bg-white/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20"
    >
      Sign out
    </Button>
  );
}

export default LougoutButton;
