import { apiClient } from "@lipy/lib/api";
import { useStore } from "@lipy/lib/hooks/use-store";
import { authClient } from "@lipy/lib/providers/auth";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
	FormInput,
	FormToggleGroup,
} from "@lipy/web-ui/components/forms/elements";
import {
	MultiStepLayout,
	useMultiStepForm,
} from "@lipy/web-ui/components/forms/multi-step";
import { Button } from "@lipy/web-ui/components/ui/button";
import { CopyButton } from "@lipy/web-ui/components/ui/copy-button";
import { Label } from "@lipy/web-ui/components/ui/label";
import { cn } from "@lipy/web-ui/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import QRCode from "react-qr-code";
export const Route = createFileRoute("/register/")({
	component: RouteComponent,
});

const storeTypes = [
	"grocery",
	"pharmacy",
	"fruits_and_vegetables",
	"restaurant",
	"cafe",
	"hardware",
];

const step1 = {
	id: "store_info",
	title: "Store Information",
	description: "Tell us about your store",
	children: () => (
		<>
			<FormInput
				label="Store Name"
				name="name"
				placeholder="Your Store Name"
				required
			/>
			<FormInput
				label="Support Phone"
				name="phone"
				placeholder="Your Store Phone Number"
				required
			/>
			<FormInput
				label="Support Email"
				name="email"
				placeholder="Your Store Email Address"
				required
			/>
			<FormToggleGroup
				label="Store Category"
				name="type"
				opts={storeTypes.map((s) => ({
					label: s.replaceAll("_", " "),
					value: s,
				}))}
				required
				type="single"
			/>
		</>
	),
};
const step2 = {
	id: "store_address",

	title: "Store Address",
	description: "Tell us about your store.",
	children: () => (
		<>
			<FormInput
				label="Building / Flat / Shop no. "
				name="address.line1"
				required
			/>
			<FormInput
				label="Locality Area / Land mark"
				name="address.line2"
				required
			/>
			<div className="grid md:grid-cols-2 md:gap-4">
				<FormInput label="City" name="address.city" required />
				<FormInput label="Pin code" name="address.postalCode" required />
			</div>
			<div className="grid md:grid-cols-2 md:gap-4">
				<FormInput label="State" name="address.state" required />

				<FormInput label="Country" name="address.country" required />
			</div>
		</>
	),
};

const step3 = {
	id: "store_payments",
	title: "Payments Information",
	description: "Tell us your UPI ID.",

	children: () => {
		const { data } = useMultiStepForm();
		const form = useFormContext();

		const payments = form.watch("payments");

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			if (!payments?.upiIds?.[0]?.name) {
				form.setValue("payments.upiIds.0.name", data?.store_info?.name);
			}
		}, [payments]);

		return (
			<div className="">
				<FormInput
					label="Store UPI ID"
					name="payments.upiIds[0].id"
					placeholder="upi@okhdfcbank"
					required
				/>

				<div className="md:bg-accent/50 rounded p-0 md:p-4">
					<UPIQRCode
						upi={payments?.upiIds?.[0]?.id?.toLowerCase()}
						name={payments?.upiIds?.[0]?.name}
					/>
				</div>
				{/* upi://pay?pa=upi@okhdfcbank&pn=Kundan%20Bhosale&aid=uGA2123gMvebQ */}
			</div>
		);
	},
};

function UPIQRCode({ upi, name }: { upi: string; name: string }) {
	const val = `upi://pay?pa=${upi}&pn=${name}`;
	return (
		<div className="bg-card p-8 overflow-hidden border drop-shadow-xs rounded w-fit flex flex-col justify-center items-center space-y-4 m-auto transition-all">
			<img src="/assets/upi-bhim.svg" alt="Upi" width={150} />

			<div className="relative">
				<QRCode
					title={name}
					value={val}
					level="H"
					className={cn("transition-all w-full", !upi && "blur")}
				/>
				{!upi && (
					<span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition-all">
						<Button
							variant={"outline"}
							size={"sm"}
							className="rounded-full w-fit text-sm text-muted-foreground"
						>
							<Info className="size-4" />
							<span>No UPI</span>
						</Button>
					</span>
				)}
			</div>

			<div className={cn("text-center transition-all", !upi && "hidden")}>
				<Label className="flex items-center gap-1 text-muted-foreground">
					{upi}
					<CopyButton value={val} />
				</Label>
				<p className="text-base">{name}</p>
			</div>
		</div>
	);
}

function RouteComponent() {
	const router = useRouter();
	const store = useStore();

	const mutation = useAPIMutation(apiClient.v1.shops, "$post", {
		onSuccess: async (data) => {
			await authClient.organization.setActive({ organizationId: data.id });
			router.navigate({ to: "/" });
		},
	});

	const handleSubmit = async (data: any) => {
		console.log(data);
		await mutation.mutateAsync({ json: data });
	};

	useEffect(() => {
		if (store.isLoading) return;
		store.data?.id && router.navigate({ from: "/register", to: "/" });
	}, [store, router.navigate]);

	return (
		<MultiStepLayout
			loading={store.isLoading || !!store.data?.id}
			steps={[step1, step2, step3]}
			onSubmit={handleSubmit}
		/>
	);
}
