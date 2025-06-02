import { formatAmount } from "@lipy/lib/utils/intl";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Label } from "@lipy/web-ui/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(loggedIn)/order/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { data } = useAPIQuery(apiClient.v1.address, "$get", {});
	return (
		<div className="min-h-screen flex flex-col">
			<DashboardHeader title="Edit Order" />
			<div className="lg:grid lg:grid-cols-12 divide-x flex-1">
				<div className="col-span-8 divide-y py-4 lg:p-4">
					<div className="flex flex-col lg:flex-row gap-8 lg:gap-4 p-4 justify-between">
						<div>
							<div>
								<h1 className="text-2xl font-semibold">Order ID: #24356</h1>
							</div>
							<div className="flex gap-2">
								<p>
									Order Date: <span className="font-medium">Feb 16 2025</span>
								</p>
								|<p className="text-primary">Delivery in 10 mins</p>
							</div>
						</div>
						<div className="flex gap-4">
							<Button variant={"outline"}>Invoice</Button>
							<Button>Change Status</Button>
						</div>
					</div>
					<div className="py-4">
						{[...Array(6)].map((_m, i) => (
							<div key={i} className="flex gap-2 items-center p-4">
								<img
									src="https://picsum.photos/200"
									alt=""
									className="size-12 border rounded bg-accent"
								/>
								<div className="flex-1">
									<h2 className="font-semibold">Some product title.</h2>
									<p className="text-sm text-muted-foreground">
										Color Blue, 5kg
									</p>
								</div>
								<div className="text-right">
									<p className="font-medium">{formatAmount("inr", 100.13)}</p>
									<p className="text-sm text-muted-foreground">Qty 1</p>
								</div>
							</div>
						))}
					</div>
				</div>

				<div className="col-span-4 space-y-4 py-4 lg:p-4 divide-y border-t">
					<div className="space-y-4 p-4">
						<Label>Payment Summary</Label>
						<div className="space-y-4">
							<div className="flex justify-between">
								<p>Item Total (6 Items)</p>
								<p className="font-medium">{formatAmount("inr", 600)}</p>
							</div>
							<div className="flex justify-between">
								<p>Delivery Charges</p>
								<p className="font-medium">{formatAmount("inr", 20)}</p>
							</div>
							<div className="flex justify-between">
								<p>Taxes</p>
								<p className="font-medium">{formatAmount("inr", 40)}</p>
							</div>
						</div>
					</div>
					<div className="flex justify-between items-center p-4">
						<p className="font-semibold text-xl">Total Payable</p>
						<p className="font-semibold text-3xl mb-2">
							{formatAmount("inr", 660)}
						</p>
					</div>
					<div className="space-y-4 p-4">
						<Label>Contact Info</Label>
						<div className="space-y-1">
							<p className="">Kundan Mahadev Bhosale</p>
							<p className="">
								<span>+91 9325029116</span>
							</p>
						</div>
					</div>
					<div className="space-y-4 p-4">
						<Label>Delivery Address</Label>
						<div className="space-y-1">
							<p className="">
								Bhagwan Pur, Chhapra - Rewa - Muzaffarpur Rd, Shrirampuri,
								Muzaffarpur
							</p>
							<p>Bhagwanpur</p>
							<p>842001</p>
							<p>Bihar, India</p>
						</div>
					</div>
					<div className="space-y-4 p-4">
						<Label>Delivery Partner</Label>

						<div className="space-y-4">
							<div className="flex gap-2">
								<Avatar className="size-12">
									<AvatarImage src="https://picsum.photos/200" alt="" />
									<AvatarFallback>A</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">Kundan Bhosale</p>
									<p className="text-sm">+91 3567866754</p>
								</div>
							</div>
							<p className="font-light text-sm">
								Delivery partner was assigned on 12 Feb 2025
							</p>
						</div>
					</div>

					{/* <div className="space-y-2">
						<Label>Billing Address</Label>
						<div className="space-y-1">
							<p className="">
								Bhagwan Pur, Chhapra - Rewa - Muzaffarpur Rd, Shrirampuri,
								Muzaffarpur
							</p>
							<p>Bhagwanpur</p>
							<p>842001</p>
							<p>Bihar, India</p>
						</div>
					</div> */}
				</div>
			</div>
		</div>
	);
}
