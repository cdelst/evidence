import Link from "next/link";

import { EvidenceTypeForm } from "~/components/EvidenceTypeForm";
import { EvidenceTypeTable } from "@/components/EvidenceTypeTable";
import { getServerAuthSession } from "~/server/auth";
import { apiServer } from "~/trpc/server";
import { EvidenceForm } from "~/components/EvidenceForm";
import { TagForm } from "~/components/TagForm";
import { TagTable } from "~/components/TagTable";
import { EvidenceTable } from "~/components/EvidenceTable";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#9782b6] to-[#7179ff] text-white">
      <header className="bg-gradient-to-r from-purple-500 to-indigo-600 p-5 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Evidence</h1>
          <div>
            {session ? (
              <span>Logged in as {session.user?.name}</span>
            ) : (
              <Link href="/api/auth/signin">Sign in</Link>
            )}
            <Link
              href={session ? "/api/auth/signout" : "/api/auth/signin"}
              className="ml-4 rounded-full bg-white/10 px-4 py-2 font-semibold no-underline transition hover:bg-white/20"
            >
              {session ? "Sign out" : "Sign in"}
            </Link>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 grid-rows-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <section className="col-span-1 lg:col-span-2">
            <EvidenceForm />
          </section>
          <section className="col-span-1 lg:col-span-3 lg:row-span-1">
            <EvidenceTable />
          </section>
          <section className="col-span-1 lg:col-span-2">
            <EvidenceTypeForm />
          </section>
          <section className="col-span-1 lg:col-span-3 lg:row-span-1">
            <EvidenceTypeTable />
          </section>
          <section className="col-span-1 lg:col-span-2">
            <TagForm />
          </section>
          <section className="col-span-1 lg:col-span-3 lg:row-span-1">
            <TagTable />
          </section>
        </div>
      </div>
    </main>
  );
}
