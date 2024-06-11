import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"; 
import {
  Table as BaseTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";

interface DataTableProps<TData extends { id: string }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (data: TData) => void;
  onEdit: (id: string) => void;
}

import { MoreVertical } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function Table<TData extends { id: string }, TValue>({
  data,
  columns,
  onDelete,
  onEdit,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full flex-col rounded-xl border bg-primary-foreground relative">
      <BaseTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="text-primary">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="flex-1">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="align-middle text-foreground relative group"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="h-auto max-w-10 text-wrap break-words"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <div className="absolute right-0 top-0 h-full flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-32 right-0 mr-10 bg-white shadow-lg rounded-lg p-2">
                      <div className="flex flex-col space-y-2">
                        <Button
                          onClick={() => onDelete(row.original)}
                          className="w-full py-2 text-sm hover:bg-gray-100 bg-white text-black"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => onEdit(row.original.id)}
                          className="w-full py-2 text-sm hover:bg-gray-100 bg-white text-black"
                        >
                          Edit
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </BaseTable>
    </div>
  );
}
