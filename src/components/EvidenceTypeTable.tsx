"use client";

import { type EvidenceType } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "~/trpc/react";
import { Badge } from "./ui/badge";

const columns: ColumnDef<EvidenceType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

export function EvidenceTypeTable() {
  const { data } = apiClient.evidenceType.getAllEvidenceTypes.useQuery();
  const utils = apiClient.useUtils();
  const { mutateAsync: deleteEvidenceType } =
    apiClient.evidenceType.deleteEvidenceType.useMutation();

  if (!data) {
    return <div>Loading...</div>;
  }

  const onDelete = async (data: EvidenceType) => {
    await deleteEvidenceType({ id: data.id });
    await utils.evidenceType.invalidate();
  };

  return (
    <div className="flex h-full flex-row flex-wrap rounded-2xl bg-primary-foreground p-4">
      {data.map((evidenceType) => (
        <div key={evidenceType.id}>
          <Badge
            key={evidenceType.id}
            variant="default"
            className="mr-2 text-sm"
          >
            {evidenceType.name}
            <button
              onClick={() => onDelete(evidenceType)}
              className="ml-2 cursor-pointer "
            >
              X
            </button>
          </Badge>
        </div>
      ))}
    </div>
  );
}
