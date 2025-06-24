import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@lipy/lib/providers/auth";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@lipy/web-ui/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@lipy/web-ui/components/ui/select";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@lipy/web-ui/components/ui/table";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { MoreVertical, Plus, SendHorizonal, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const Route = createFileRoute("/(loggedIn)/store/staff")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isMobile } = useViewport();
	const { data: store } = authClient.useActiveOrganization();

	const invitations = store?.invitations.filter(
		(i) => i.status === "pending" || i.status === "rejected",
	);
	return (
		<div>
			<DashboardHeader title="My Staff">
				<InviteMember />
			</DashboardHeader>

			<div className="lg:p-8">
				<div className="space-y-10 mb-8 mt-4 lg:mt-0">
					{isMobile ? (
						<MobileViewMember />
					) : (
						<>
							<div>
								<h1 className="text-lg font-medium my-4 ">Staff List</h1>
								<Table className="border">
									<TableHeader>
										<TableRow className="bg-accent/40">
											<TableHead>Name</TableHead>
											<TableHead>Email</TableHead>

											<TableHead>Role</TableHead>
											<TableHead>Joined on</TableHead>
											<TableHead />
										</TableRow>
									</TableHeader>
									<TableBody className="bg-white">
										{store?.members.map((member, index) => (
											<TableRow key={index}>
												<TableCell className="flex items-center gap-2">
													<Avatar className="size-8">
														<AvatarImage src={member.user.image} />
														<AvatarFallback>A</AvatarFallback>
													</Avatar>
													<p className="font-medium text-base">
														{member.user.name ||
															member.user.email.split("@")[0]}
													</p>
												</TableCell>
												<TableCell className="">
													<div>
														<p className="text-muted-foreground line-clamp-1">
															{member.user.email}
														</p>
													</div>
												</TableCell>

												<TableCell>
													<Badge size={"large"} variant={"success"}>
														{member.role.toUpperCase()}
													</Badge>
												</TableCell>
												<TableCell>{format(member.createdAt, "PP")}</TableCell>
												<TableCell>
													<StaffOptions memberId={member.id} />
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							{invitations && invitations.length > 0 && (
								<div>
									<h1 className="text-lg font-medium my-4 ">Invitations</h1>
									<Table className="border">
										<TableHeader>
											<TableRow className="bg-accent/40">
												<TableHead>Email</TableHead>

												<TableHead>Role</TableHead>
												<TableHead>Status</TableHead>
												<TableHead>Invited by</TableHead>
												<TableHead>Cancel</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody className="bg-white">
											{invitations.map((invitee, index) => {
												const inviter = store?.members.find(
													(member) => member.user.id === invitee.inviterId,
												);

												return (
													<TableRow key={index}>
														<TableCell>
															<p className="line-clamp-1 font-normal text-base">
																{invitee.email}
															</p>
														</TableCell>

														<TableCell>
															<Badge size={"large"} variant={"accent"}>
																{invitee.role.toUpperCase()}
															</Badge>
														</TableCell>

														<TableCell>
															<Badge variant={"status"}>
																{invitee.status.charAt(0).toUpperCase() +
																	invitee.status.slice(1)}
															</Badge>
														</TableCell>
														<TableCell className="flex items-center gap-2">
															<Avatar className="size-6">
																<AvatarImage src={inviter?.user.image} />
																<AvatarFallback>A</AvatarFallback>
															</Avatar>

															<p>
																{inviter?.user.name ||
																	inviter?.user.email ||
																	"Unknown"}
															</p>
														</TableCell>
														<TableCell>
															<CancelInvitation
																invitationId={invitee.id}
																status={invitee.status}
															/>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
}

function InviteMember() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const formSchema = z.object({
		email: z.string().email(),
		role: z.enum(["admin", "member", "owner"]),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			role: "member",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const { error, data } = await authClient.organization.inviteMember({
			email: values.email,
			role: values.role,
		});
		if (error) {
			toast.error(error.message || error.statusText || "Something went wrong");
		}
		if (data) {
			toast.success("Invitation sent successfully");
			setDialogOpen(false);
		}
	}

	const rolesList = [
		{
			label: "Admin",
			value: "admin",
		},
		{
			label: "Member",
			value: "member",
		},
		{
			label: "Owner",
			value: "owner",
		},
	];
	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<DialogTrigger onClick={() => setDialogOpen(true)}>
				<Button>
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
											<SelectTrigger className="min-w-1/2">
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

const StaffOptions = ({
	memberId,
}: {
	memberId: string;
}) => {
	const handleRemoveStaff = async () => {
		toast.promise(
			authClient.organization
				.removeMember({
					memberIdOrEmail: memberId, // this can also be the email of the member
				})
				.then(({ error, data }) => {
					if (error) {
						throw new Error(
							error.message || error.statusText || "Something went wrong",
						);
					}
					return data;
				}),
			{
				success: "Staff removed successfully",
				error: (err) => {
					return err.message;
				},
				loading: "Removing ...",
			},
		);
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<Button variant={"ghost"} size="icon-sm">
					<MoreVertical />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem
					onClick={() => {
						handleRemoveStaff();
					}}
				>
					Remove staff
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

const CancelInvitation = ({
	invitationId,
	type,
	status,
}: {
	invitationId: string;
	type?: "text" | "icon";
	status?: "pending" | "accepted" | "rejected" | "canceled";
}) => {
	const handleCancelInvite = async () => {
		toast.promise(
			authClient.organization
				.cancelInvitation({
					invitationId: invitationId,
				})
				.then(({ error, data }) => {
					if (error) {
						throw new Error(
							error.message || error.statusText || "Something went wrong",
						);
					}
					return data;
				}),
			{
				success: "Invitation cancelled successfully",
				error: (err) => {
					return err.message;
				},
				loading: "Cancelling invitation...",
			},
		);
	};
	return (
		<div>
			{type === "text" ? (
				<Button
					className="p-0"
					size="sm"
					variant="link"
					onClick={() => {
						handleCancelInvite();
					}}
					disabled={status !== "pending"}
				>
					Cancel Invitation
				</Button>
			) : (
				<Button
					variant={"rose"}
					size={"icon-sm"}
					onClick={() => {
						handleCancelInvite();
					}}
					disabled={status !== "pending"}
				>
					<X />
				</Button>
			)}
		</div>
	);
};

const MobileViewMember = () => {
	const { data: store } = authClient.useActiveOrganization();
	const invitations = store?.invitations.filter(
		(i) => i.status === "pending" || i.status === "rejected",
	);

	return (
		<div className="space-y-4">
			{store?.members && store.members.length > 0 && (
				<div className="bg-white p-4 space-y-4">
					<h1 className="text-base font-medium  ">Staff List</h1>
					<div className="divide-y divide-dashed space-y-4">
						{store?.members.map((member, index) => (
							<div key={index} className="pb-4">
								<div className="flex items-center justify-between gap-4">
									<div className="flex items-center gap-3 flex-1">
										<Avatar className="size-10">
											<AvatarImage src={member.user.image || ""} />
											<AvatarFallback>
												{member.user.name?.[0]?.toUpperCase() || "A"}
											</AvatarFallback>
										</Avatar>

										<div className="min-w-0">
											<p className="truncate font-medium">
												{member.user.name || member.user.email.split("@")[0]}
											</p>
											<p className="text-muted-foreground text-xs truncate">
												{member.user.email}
											</p>
										</div>
									</div>

									<Badge variant="success" size="small" className="shrink-0">
										{member.role.charAt(0).toUpperCase() + member.role.slice(1)}
									</Badge>

									<StaffOptions memberId={member.id} />
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{invitations && invitations.length > 0 && (
				<div className="bg-white p-4 space-y-4">
					<h1 className="text-base font-medium  ">Invitations</h1>
					<div className="divide-y divide-dashed space-y-4 ">
						{invitations.map((invitee, index) => {
							const inviter = store?.members.find(
								(member) => member.user.id === invitee.inviterId,
							);

							return (
								<div key={index} className="pb-4">
									<div className="flex justify-between items-start">
										<div className="flex items-center gap-2">
											<Avatar className="size-10">
												<AvatarFallback>
													{invitee.email.slice(0, 2).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="line-clamp-1 ">{invitee.email}</p>

												<ul className="text-muted-foreground text-xs">
													<li>
														Role :{" "}
														{invitee.role.charAt(0).toUpperCase() +
															invitee.role.slice(1)}
													</li>
													<li>
														Invited By :{" "}
														{inviter?.user.name ||
															inviter?.user.email ||
															"Unknown"}
													</li>
												</ul>
											</div>
										</div>
										<div className="flex flex-col items-end gap-1">
											<Badge size="small" variant="status">
												{invitee.status.charAt(0).toUpperCase() +
													invitee.status.slice(1)}
											</Badge>

											<CancelInvitation
												invitationId={invitee.id}
												type={"text"}
												status={invitee.status}
											/>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};
