"use client";

import { Table } from "@/components/Table";
import { type Evidence } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { useState } from 'react';
import { apiClient } from "~/trpc/react";
import { EvidenceForm } from './EvidenceForm';
import { Dialog, DialogClose, DialogContent } from './ui/dialog';

const columns: ColumnDef<Evidence>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "impact",
    header: "Impact",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "evidenceType",
    header: "Evidence Type",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return <div>{row.original.date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 2000,
  },
];

export function EvidenceTable() {
  const { data } = apiClient.evidence.getAllEvidence.useQuery();
  const utils = apiClient.useUtils();
  const { mutateAsync: deleteEvidence } =
    apiClient.evidence.deleteEvidence.useMutation();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!data) {
    return <div>Loading...</div>;
  }

  const tableData = data.map((evidence) => ({
    ...evidence,
    evidenceType: evidence.type.name,
    tags: evidence.tags
      .map((tag) => {
        const splitTag = tag.name.split("/");
        const newTag = splitTag[0] + "/" + splitTag[3];
        return newTag;
      })
      .join(", "),
  }));

  const formData = data.map((evidence) => ({
    id: evidence.id,
    title: evidence.title,
    impact: evidence.impact.toString(),
    date: evidence.date,
    description: evidence.description ?? "",
    evidenceType: evidence.type.name,
    context: evidence.context ?? "",
    source: evidence.source ?? "",
    tags: evidence.tags.map((tag) => ({
      label: tag.name,
      value: tag.id, 
    })),
  }));

  const onDelete = async (data: Evidence) => {
    await deleteEvidence({ id: data.id });
    await utils.evidence.invalidate();
  };

  const onEdit = (id: string) => {
    console.log(id)

    setEditingId(id);
  };

  const handleClose = () => {
    setEditingId(null);
  };

  return (
    <>
      {editingId && (
        <Dialog open={editingId !== null} onOpenChange={(open) => !open && setEditingId(null)}>
          <DialogContent>
            <EvidenceForm handleClose={handleClose} initialData={formData.filter((item) => item.id === editingId)[0]} />
            <DialogClose asChild>
              <button
                className="absolute right-3 top-3 text-white"
                onClick={() => setEditingId(null)}
              >
                Close
              </button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
      <Table
        data={tableData}
        columns={columns}
        onDelete={onDelete}
        onEdit={onEdit}
      />
    </>
  );
}
