import { createFileRoute } from "@tanstack/react-router";
import { DataTableColumnHeader } from "@web-ui/components/table/column-header";
import { DataTable } from "@web-ui/components/table/data-table";
import { DataTableToolbar } from "@web-ui/components/table/toolbar";
import { Checkbox } from "@web-ui/components/ui/checkbox";

import React from "react";

import { Badge } from "@web-ui/components/ui/badge";
import { Button } from "@web-ui/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@web-ui/components/ui/dropdown-menu";
import { useDataTable } from "@web-ui/hooks/use-data-table";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  CheckCircle2,
  DollarSign,
  MoreHorizontal,
  Text,
  XCircle,
} from "lucide-react";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";

export const Route = createFileRoute("/(loggedIn)/order/")({
  component: RouteComponent,
});

interface Project {
  id: string;
  title: string;
  status: "active" | "inactive";
  budget: number;
}

const data: Project[] = [
  {
    id: "1",
    title: "Project Alpha",
    status: "active",
    budget: 50000,
  },
  {
    id: "2",
    title: "Project Beta",
    status: "inactive",
    budget: 75000,
  },
  {
    id: "3",
    title: "Project Gamma",
    status: "active",
    budget: 25000,
  },
  {
    id: "4",
    title: "Project Delta",
    status: "active",
    budget: 100000,
  },
  {
    id: "5",
    title: "Project Epsilon",
    status: "inactive",
    budget: 60000,
  },
  {
    id: "6",
    title: "Project Zeta",
    status: "active",
    budget: 30000,
  },
  {
    id: "7",
    title: "Project Eta",
    status: "active",
    budget: 85000,
  },
  {
    id: "8",
    title: "Project Theta",
    status: "inactive",
    budget: 40000,
  },
  {
    id: "9",
    title: "Project Iota",
    status: "active",
    budget: 95000,
  },
  {
    id: "10",
    title: "Project Kappa",
    status: "inactive",
    budget: 55000,
  },
  {
    id: "11",
    title: "Project Lambda",
    status: "active",
    budget: 47000,
  },
  {
    id: "12",
    title: "Project Mu",
    status: "active",
    budget: 62000,
  },
];

function RouteComponent() {
  const [title] = useQueryState("title", parseAsString.withDefault(""));
  const [status] = useQueryState(
    "status",
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const columns = React.useMemo<ColumnDef<Project>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 32,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Title" />
        ),
        cell: ({ cell }) => <div>{cell.getValue<Project["title"]>()}</div>,
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
        cell: ({ cell }) => {
          const status = cell.getValue<Project["status"]>();
          const Icon = status === "active" ? CheckCircle2 : XCircle;

          return (
            <Badge variant="outline" className="capitalize">
              <Icon />
              {status}
            </Badge>
          );
        },
        meta: {
          label: "Status",
          variant: "multiSelect",
          options: [
            { label: "Active", value: "active", icon: CheckCircle },
            { label: "Inactive", value: "inactive", icon: XCircle },
          ],
        },
        enableColumnFilter: true,
      },
      {
        id: "budget",
        accessorKey: "budget",
        header: ({ column }: { column: Column<Project, unknown> }) => (
          <DataTableColumnHeader column={column} title="Budget" />
        ),
        cell: ({ cell }) => {
          const budget = cell.getValue<Project["budget"]>();

          return (
            <div className="flex items-center gap-1">
              <DollarSign className="size-4" />
              {budget.toLocaleString()}
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
