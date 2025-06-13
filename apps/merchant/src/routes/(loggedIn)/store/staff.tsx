import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Badge } from "@lipy/web-ui/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";

import { Button } from "@lipy/web-ui/components/ui/button";
import { Input } from "@lipy/web-ui/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@lipy/web-ui/components/ui/table";
import { createFileRoute } from "@tanstack/react-router";
import { MoreVertical, Search } from "lucide-react";

export const Route = createFileRoute("/(loggedIn)/store/staff")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<DashboardHeader title="My Staff" />

			<div className="space-y-4  max-w-4xl p-8">
				<div>
					<Card className="grid grid-cols-2 lg:grid-cols-4 divide-x">
						<CardHeader>
							<CardTitle>100</CardTitle>
							<CardDescription>
								<h2>Total Members</h2>
							</CardDescription>
						</CardHeader>
						<CardHeader>
							<CardTitle>20</CardTitle>
							<CardDescription>
								<h2>Delivery Agents</h2>
							</CardDescription>
						</CardHeader>
						<CardHeader>
							<CardTitle>20</CardTitle>
							<CardDescription>
								<h2>In-house Staff</h2>
							</CardDescription>
						</CardHeader>
						<CardHeader>
							<CardTitle>20</CardTitle>
							<CardDescription>
								<h2>Admins</h2>
							</CardDescription>
						</CardHeader>
					</Card>
				</div>
				<div className="flex gap-4">
					<Input
						prefixEl={<Search />}
						placeholder="Search Staff"
						className="flex-1"
					/>
					<Button>New Member</Button>
				</div>
				<div className="grid divide-y lg:gap-4">
					<div className="bg-background">
						<h1 className="text-lg font-medium my-4 ">Staff List</h1>
						<Table className="">
							<TableBody>
								{[...Array(1)].map((_product, i) => (
									<TableRow
										key={i}
										className="flex items-center justify-between"
									>
										<div>
											<TableCell className="py-2 ">
												<Avatar className="size-10">
													<AvatarImage />
													<AvatarFallback>A</AvatarFallback>
												</Avatar>
											</TableCell>
											<TableCell className="">
												<div>
													<p className="font-medium">Kundan Bhosale</p>
													<p className="font-light line-clamp-1">
														kundan@gmail.com
													</p>
												</div>
											</TableCell>
										</div>
										<TableCell>
											<Badge size={"large"}>Owner</Badge>
										</TableCell>

										<TableCell>
											<Button className="" variant={"ghost"} size={"icon"}>
												<MoreVertical />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}
