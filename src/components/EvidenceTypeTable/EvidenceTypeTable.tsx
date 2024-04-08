"use client";

import { apiClient } from "~/trpc/react";
import { columns } from "@/components/EvidenceTypeTable/columns";
import { Table } from "@/components/Table";
import { type EvidenceType } from "@prisma/client";

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

  return <Table data={data} columns={columns} onDelete={onDelete} />;
}
