import {
  apiQueryOptions,
  useAPIMutation,
  useAPIQuery,
} from "@lipy/lib/utils/useQueryClient";
import type { STORE_ROLES } from "@lipy/server/middlewares/auth";
import { FormButton, FormInput } from "@lipy/web-ui/components/forms/elements";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@lipy/web-ui/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";
import type { InferResponseType } from "hono";

import { env } from "@envClient";
import { merchantStoreApi } from "@lipy/lib/api";
import {
  DrawerDialogClose,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { CopyButton } from "@lipy/web-ui/components/ui/copy-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lipy/web-ui/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@lipy/web-ui/components/ui/table";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, isBefore } from "date-fns";
import { Link, Plus, SendHorizonal, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StoreNav } from "./-nav";
export const Route = createFileRoute("/(dashboard)/store/staff")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useAPIQuery(merchantStoreApi.members, "$get", {});

  return (
    <>
      <DashboardHeader title="My Staff">
        <InviteMember />
      </DashboardHeader>
      <StoreNav>
        <div className="p-4 lg:p-8">
          <div className="space-y-4">
            {data?.invitations && data.invitations.length > 0 && (
              <Invitation data={data} />
            )}
            {data?.members && <Members data={data} />}
          </div>
        </div>
      </StoreNav>
    </>
  );
}

function Members({
  data,
}: {
  data: InferResponseType<typeof merchantStoreApi.members.$get>;
}) {
  const queryClient = useQueryClient();
  const queryKey = apiQueryOptions(
    merchantStoreApi.members,
    "$get",
    {}
  ).queryKey;
  const mutation = useAPIMutation(merchantStoreApi.member[":id"], "$delete", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
  const handleRemove = async (id: string) => {
    await mutation.mutateAsync({ param: { id } });
  };

  const { isMobile } = useViewport();

  const Btn = ({ m }: { m: (typeof data)["members"][0] }) => (
    <div className="flex gap-2">
      <DrawerDialogSwitcher
        trigger={
          <Button
            variant={"outline"}
            size={"icon-sm"}
            disabled={mutation.isPending}
          >
            <X />
          </Button>
        }
      >
        <DrawerDialogHeader>
          <DrawerDialogTitle>Are you sure?</DrawerDialogTitle>
          <DrawerDialogDescription>
            This action is not reversible.
          </DrawerDialogDescription>
        </DrawerDialogHeader>
        <DrawerDialogFooter>
          <DrawerDialogClose />
          <Button
            disabled={mutation.isPending}
            onClick={() => handleRemove(m.id!)}
          >
            Remove Member
          </Button>
        </DrawerDialogFooter>
      </DrawerDialogSwitcher>
    </div>
  );

  if (isMobile) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 divide-y">
            {data.members.map((m, i) => (
              <div key={i} className="pb-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Avatar className="size-10">
                        <AvatarImage src={m.image || ""} />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="">{m.name || m?.email?.split("@")[0]}</p>
                        <p className="text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                    <Btn m={m} />
                  </div>
                  <div className="gap-2 flex">
                    <Badge variant={"accent"} className="capitalize">
                      {m.role}
                    </Badge>
                    {m.createdAt && (
                      <Badge variant={"success"} className="capitalize">
                        Joined on {format(m.createdAt, "PP")}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-lg font-medium my-4 ">Staff List</h1>
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-accent/40">
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>

            <TableHead className="w-24">Role</TableHead>
            <TableHead className="w-64">Joined on</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {data?.members.map((member, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="size-6">
                    <AvatarImage src={member.image || ""} />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <p className="">
                    {member.name || member?.email?.split("@")[0]}
                  </p>
                </div>
              </TableCell>
              <TableCell className="">
                <div>
                  <p className="text-muted-foreground line-clamp-1">
                    {member.email}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  size={"large"}
                  variant={"success"}
                  className="capitalize"
                >
                  {member.role}
                </Badge>
              </TableCell>
              <TableCell>
                {member.createdAt && format(member.createdAt, "PP")}
              </TableCell>
              <TableCell>
                {" "}
                <Btn m={member} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function Invitation({
  data,
}: {
  data: InferResponseType<typeof merchantStoreApi.members.$get>;
}) {
  const queryClient = useQueryClient();
  const queryKey = apiQueryOptions(
    merchantStoreApi.members,
    "$get",
    {}
  ).queryKey;
  const cancelInvitation = useAPIMutation(
    merchantStoreApi.invitation[":id"],
    "$delete",
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey,
        });
      },
    }
  );
  const handleCancel = async (id: string) => {
    await cancelInvitation.mutateAsync({ param: { id } });
  };

  const { isMobile } = useViewport();

  const Btn = ({ m }: { m: (typeof data.invitations)[0] }) => {
    return (
      <div className="flex gap-2">
        <CopyButton
          value={`${env.MERCHANT_URL}/accept-invitation/${m.id}`}
          variant={"outline"}
          icon={<Link />}
        />
        {/* <Button variant={"outline"} size={"icon-sm"}>
				<Mail />
			</Button> */}
        <DrawerDialogSwitcher
          trigger={
            <Button
              variant={"outline"}
              size={"icon-sm"}
              disabled={cancelInvitation.isPending}
            >
              <X />
            </Button>
          }
        >
          <DrawerDialogHeader>
            <DrawerDialogTitle>Are you sure?</DrawerDialogTitle>
            <DrawerDialogDescription>
              This action is not reversible.
            </DrawerDialogDescription>
          </DrawerDialogHeader>
          <DrawerDialogFooter>
            <DrawerDialogClose />
            <Button
              disabled={cancelInvitation.isPending}
              onClick={() => handleCancel(m.id)}
            >
              Cancel Invitation
            </Button>
          </DrawerDialogFooter>
        </DrawerDialogSwitcher>
      </div>
    );
  };
  if (isMobile) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 divide-y">
            {data.invitations.map((m, i) => (
              <div key={i} className="pb-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p>{m.email}</p>
                    <Btn m={m} />
                  </div>
                  <div className="gap-2 flex">
                    <Badge variant={"accent"} className="capitalize">
                      {m.role}
                    </Badge>
                    <Badge variant={"success"} className="capitalize">
                      {isBefore(new Date(m.expiresAt), new Date())
                        ? "Expried"
                        : m.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-lg font-medium my-4">Invitations</h1>
      <Table className="border">
        <TableHeader>
          <TableRow className="bg-accent/40">
            <TableHead>Email</TableHead>
            <TableHead className="w-24">Role</TableHead>
            <TableHead className="w-24">Status</TableHead>
            <TableHead className="w-64">Invited by</TableHead>
            <TableHead className="w-24" />
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {data.invitations.map((m, index) => {
            const inviter = data?.members.find(
              (member) => member.userId === m.inviterId
            );

            return (
              <TableRow key={index}>
                <TableCell>
                  <p className="line-clamp-1">{m.email}</p>
                </TableCell>

                <TableCell>
                  <Badge
                    size={"large"}
                    variant={"accent"}
                    className="capitalize"
                  >
                    {m.role}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={"status"} className="capitalize">
                    {isBefore(new Date(m.expiresAt), new Date())
                      ? "Expired"
                      : m.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage src={inviter?.image || ""} />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>

                    <p>{inviter?.name || inviter?.email || "Unknown"}</p>
                  </div>
                </TableCell>
                <TableCell>
                  {" "}
                  <Btn m={m} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function InviteMember() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = apiQueryOptions(
    merchantStoreApi.members,
    "$get",
    {}
  ).queryKey;
  const invite = useAPIMutation(merchantStoreApi.invite, "$post", {
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey,
      });
      setDialogOpen(false);
    },
  });

  const defaultValues = {
    email: "",
    role: "staff" as (typeof STORE_ROLES)[number],
  };
  const form = useForm({
    defaultValues,
  });

  async function onSubmit(values: typeof defaultValues) {
    await invite.mutateAsync({
      json: {
        email: values.email,
        role: values.role,
      },
    });
  }

  const rolesList: Array<{
    label: string;
    value: (typeof STORE_ROLES)[number];
  }> = [
    {
      label: "Owner",
      value: "owner",
    },
    {
      label: "Admin",
      value: "admin",
    },
    {
      label: "Staff",
      value: "staff",
    },
    {
      label: "Delivery Agent",
      value: "delivery_agent",
    },
  ];

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger onClick={() => setDialogOpen(true)}>
        <Button size={"sm"}>
          <Plus />
          New Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite members</DialogTitle>
          <DialogDescription>
            Send invitation to join your store.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormInput
              name="email"
              label="Email"
              placeholder="example@gmail.com"
              required
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <Label>Role</Label>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="min-w-1/2 capitalize">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="w-full">
                      {rolesList.map((role) => (
                        <SelectItem value={role.value} key={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormButton type="submit" className="flex ml-auto">
              <div className="flex items-center gap-2">
                <p>Send Invitation </p>
                <SendHorizonal />
              </div>
            </FormButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
