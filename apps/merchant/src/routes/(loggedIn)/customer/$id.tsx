import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Card, CardAction, CardContent } from "@lipy/web-ui/components/ui/card";
import { Label } from "@lipy/web-ui/components/ui/label";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { PenLine, Trash } from "lucide-react";
import DeleteCustomer from "./-delete";
import { CustomerForm } from "./-form";

export const Route = createFileRoute("/(loggedIn)/customer/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const isMobile = useViewport();
	// const product = useAPIQuery(apiClient.v1.merchant.customer[":id"], "$get", {
	// 	param: { id },
	// });

	return (
		<>
			<DashboardHeader title="Customer Details" />
			<Card className="m-4 max-w-5xl">
				<CardContent className="space-y-8">
					<CardAction className={cn("flex gap-2")}>
						<DeleteCustomer>
							<Button variant={"outline"} size={"sm"}>
								<Trash /> {!isMobile && "Delete"}
							</Button>
						</DeleteCustomer>
						<CustomerForm type="create">
							<Button className="" size={"sm"} variant={"outline"}>
								<PenLine /> {!isMobile && "Edit"}
							</Button>
						</CustomerForm>
					</CardAction>
					<div>
						<div className="relative">
							<img
								src={""}
								alt={"Untitled"}
								className="size-24 aspect-square object-cover bg-accent border rounded"
							/>
						</div>
					</div>
					<div className="grid grid-cols-[120px_auto] gap-x-4 gap-y-8 items-start [&_label]:leading-snug [&_p]:text-muted-foreground">
						{/* {data?.highlights.map((d, i) => (
								<Fragment key={i}>
									<Label>{d.label}</Label>
									<p>{d.value}</p>
								</Fragment>
							))} */}
						<Label>Name</Label>
						<p>Kundan Bhosale</p>
						<Label>Email</Label>
						<p>kunadan@gmail.com</p>
						<Label>Phone</Label>
						<p>+91423567546345</p>
						<Label>Address</Label>
						<p>Ulwe, Navi Mumbai, Maharashtra</p>
					</div>
					{/* <div className="flex gap-4">
									<div className="relative">
										<img
											src={data?.thumbnail || ""}
											alt={data?.title || "Untitled"}
											className="size-24 aspect-square object-cover bg-accent border rounded"
										/>
										{(data?.images?.length || 0) > 0 && (
											<Badge variant={"outline"} className="absolute -top-1 -right-1">
												{data?.images?.length}+
											</Badge>
										)}
									</div>
									<div className="flex justify-between w-full">
										<div>
											<p className="text-lg">{data?.title}</p>
											<p className="text-sm text-muted-foreground">
												{data?.category.title}
											</p>
			
											{/* <p className="text-sm text-muted-foreground">{data.summary}</p> */}
					{/* </div>
										<div>
											<Badge variant={"success"}>
												{formatAmount("inr", mrp - sp)} Off
											</Badge>
											<p className="text-2xl font-medium">
												{formatAmount("inr", sp)}{" "}
												<span className="line-through text-muted-foreground text-base">
													{formatAmount("inr", mrp)}
												</span>
											</p>
										</div>
									</div>
								</div>  */}
				</CardContent>
			</Card>
		</>
	);
}
