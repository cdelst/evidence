import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import LoginButton from "~/components/LoginButton";
import LogoutButton from "~/components/LogoutButton";

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
        {session ? (
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
                  <span>Logged in as {session.user?.name}</span>
                  <div className="ml-4">
                    <LogoutButton />
                  </div>
                </div>
              </div>
            </header>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
        ) : (
          <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#9782b6] to-[#7179ff] text-white">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">Ready to LevelUp?</h1>
              <p className="mb-4">Please sign in to continue</p>
              <div className="flex justify-center">
                <LoginButton />
              </div>
            </div>
          </main>
        )}
      </body>
    </html>
  );
}
