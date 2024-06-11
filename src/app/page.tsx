"use client";


import { EvidenceForm } from "~/components/EvidenceForm";
import { EvidenceTable } from "~/components/EvidenceTable";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col">
        <Dialog>
          <DialogTrigger asChild>
            <button
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out transform hover:-translate-y-1"
            >
              +
            </button>
          </DialogTrigger>
          <DialogContent>
            <EvidenceForm handleClose={() => {console.log("implement me")}}/>
            <DialogClose asChild>
              <button
                className="absolute top-3 right-3 text-white"
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
