"use client";

import { Table } from "@/components/Table";
import { type Tag } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import { apiClient } from "~/trpc/react";

const columns: ColumnDef<Tag>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
];

export function TagTable() {
  const { data } = apiClient.tags.getAllTags.useQuery();
  const utils = apiClient.useUtils();
  const { mutateAsync: deleteTag } = apiClient.tags.deleteTag.useMutation();

  if (!data) {
    return <div>Loading...</div>;
  }

  const onDelete = async (data: Tag) => {
    await deleteTag({ id: data.id });
    await utils.tags.invalidate();
  };

  return (
    <div className="h-96">
      <Table onEdit={() => {console.log("implement me")}} data={data} columns={columns} onDelete={onDelete} />
    </div>
  );
}
