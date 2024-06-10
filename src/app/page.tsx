"use client";

import Link from "next/link";

import { EvidenceTypeForm } from "~/components/EvidenceTypeForm";
import { EvidenceTypeTable } from "@/components/EvidenceTypeTable";
import { getServerAuthSession } from "~/server/auth";
import { apiServer } from "~/trpc/server";
import { EvidenceForm } from "~/components/EvidenceForm";
import { TagForm } from "~/components/TagForm";
import { TagTable } from "~/components/TagTable";
import { EvidenceTable } from "~/components/EvidenceTable";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "~/components/ui/dialog";

export default function Home() {
  const [isDialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out transform hover:-translate-y-1"
              onClick={openDialog}
            >
              +
            </button>
          </DialogTrigger>
          <DialogContent>
            <EvidenceForm />
            <DialogClose asChild>
              <button
                className="absolute top-3 right-3 text-white"
                onClick={closeDialog}
              >
                Close
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
        <section className="flex-1">
          <EvidenceTable />
        </section>
      </div>
    </div>
  );
}
