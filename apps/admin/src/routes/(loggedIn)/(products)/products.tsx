import { createFileRoute } from "@tanstack/react-router";
import { DataTableColumnHeader } from "@web-ui/components/table/column-header";
import { DataTable } from "@web-ui/components/table/data-table";
import { DataTableToolbar } from "@web-ui/components/table/toolbar";
import { RowInput } from "@web-ui/components/ui/row-input";

import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web-ui/components/ui/dropdown-menu";
import { useDataTable } from "@web-ui/hooks/use-data-table";
import type { Column, ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, Text, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@web-ui/components/ui/select";

export const Route = createFileRoute("/(loggedIn)/(products)/products")({
  component: RouteComponent,
});

interface Project {
  id: string;
  title: string;
  status: "active" | "inactive";
  description: string;
  price: number;
}

const data: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    description: "This is the description",
    status: "active",
    price: 50000,
  },
];

function RouteComponent() {
  const columns = React.useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ cell, table, row }) => {
          const title = cell.getValue<Project["title"]>();
          return (
            <div>
              <RowInput
                onChange={(v) =>
                  table.options.meta?.updateData({
                    ...row.original,
                    title: v,
                  })
                }
                value={title}
              />
            </div>
          );
        },
        meta: {
          label: "Title",
          placeholder: "Search titles...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ cell, table, row }) => {
          const status = cell.getValue<Project["status"]>();
          return (
            <Select
              value={status}
              onValueChange={() =>
                table.options.meta?.updateData({ ...row.original, status })
              }
            >
              <SelectTrigger noStyle>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">
                  <CheckCircle2 /> Active
                </SelectItem>
                <SelectItem value="inactive">
                  <XCircle /> Inactive
                </SelectItem>
              </SelectContent>
            </Select>
          );
        },
        // meta: {
        //   label: "Status",
        //   variant: "multiSelect",
        //   options: [
        //     { label: "Active", value: "active", icon: CheckCircle },
        //     { label: "Inactive", value: "inactive", icon: XCircle },
        //   ],
        // },
        enableColumnFilter: true,
      },
      {
        id: "description",
        accessorKey: "description",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Description" />
        ),
        cell: ({ cell, row }) => {
          const description = cell.getValue<Project["description"]>();
          return (
            <div>
              <RowInput
                onChange={(v) =>
                  table.options.meta?.updateData({
                    ...row.original,
                    description: v,
                  })
                }
                value={description}
              />
            </div>
          );
        },
      },
      {
        id: "price",
        accessorKey: "price",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ cell, row }) => {
          const price = cell.getValue<Project["price"]>();
          return (
            <div>
              <RowInput
                onChange={(v) =>
                  table.options.meta?.updateData({
                    ...row.original,
                    price: v,
                  })
                }
                type="number"
                value={price}
              />
            </div>
          );
        },
      },
      {
        id: "actions",
        cell: function Cell() {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 32,
      },
    ],
    []
  );

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 2,
    initialState: {
      sorting: [{ id: "title", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    meta: {
      updateData(row) {
        console.log(row);
      },
    },
    getRowId: (row) => row.id,
  });

  return (
    <div className="md:p-8">
      <DataTable table={table}>
        <DataTableToolbar table={table}>
          <Button size={"sm"}>New Product</Button>
        </DataTableToolbar>
      </DataTable>
    </div>
  );
}
