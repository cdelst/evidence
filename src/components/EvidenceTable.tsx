"use client";

import { apiClient } from "~/trpc/react";
import { Table } from "@/components/Table";
import { type Evidence } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

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
  },
];

export function EvidenceTable() {
  const { data } = apiClient.evidence.getAllEvidence.useQuery();
  const utils = apiClient.useUtils();
  const { mutateAsync: deleteEvidence } =
    apiClient.evidence.deleteEvidence.useMutation();

  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data)

  const tableData = data.map((evidence) => ({
    ...evidence,
    evidenceType: evidence.type.name,
    tags: evidence.tags.map((tag) => tag.name).join(", "),
  }));

  console.log(tableData);

  const onDelete = async (data: Evidence) => {
    await deleteEvidence({ id: data.id });
    await utils.evidence.invalidate();
  };

  return <Table data={tableData} columns={columns} onDelete={onDelete} />;
}
