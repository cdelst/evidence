import Link from "next/link";

import { EvidenceTypeForm } from "~/components/EvidenceTypeForm";
import { EvidenceTypeTable, columns } from "@/components/EvidenceTypeTable";
import { getServerAuthSession } from "~/server/auth";
import { apiClient } from "~/trpc/react";
import { apiServer } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  const evidenceData = await apiServer.evidenceType.getAllEvidenceTypes();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#9782b6] to-[#7179ff] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Evidence
        </h1>
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.name}</span>}
            </p>
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
        <div className="flex flex-row gap-4">
          <EvidenceTypeForm />
          <EvidenceTypeTable />
        </div>
      </div>
    </main>
  );
}
