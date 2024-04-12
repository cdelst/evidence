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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onDelete: (data: TData) => void;
}

export function Table<TData, TValue>({
  data,
  columns,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex h-full flex-col rounded-xl border bg-primary-foreground ">
      <BaseTable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="text-primary">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
              <TableHead className="text-right text-destructive">
                Delete?
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="flex-1">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? "selected" : undefined}
                className="align-middle text-foreground"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="h-auto max-w-10 text-wrap break-words"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell className="items-center justify-center text-right">
                  <Button
                    onClick={() => {
                      console.log(row);
                      onDelete(row.original);
                    }}
                  >
                    x
                  </Button>
                </TableCell>
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
