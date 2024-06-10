import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Evidence",
  description: "Created by Case Delst",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <main className="flex min-h-screen flex-col bg-gradient-to-b from-[#9782b6] to-[#7179ff] text-white">
          <header className="bg-gradient-to-r from-purple-500 to-indigo-600 p-5 shadow-lg">
            <div className="container mx-auto flex items-center">
              <Link href="/">
                <h1 className="text-3xl font-bold">LevelUp</h1>
              </Link>
              <div className="ml-10">
                <nav className="flex space-x-4">
                  <Link href="/">Evidence</Link>
                  <Link href="/tags">Tags</Link>
                  <Link href="/types">Types</Link>
                </nav>
              </div>
              <div className="ml-auto flex items-center">
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
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}
