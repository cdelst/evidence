"use client";

import { Prisma } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";
import type { EvidenceType } from "@prisma/client";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<EvidenceType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];
