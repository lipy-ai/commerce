import {
	FormButton,
	FormInput,
	FormToggleGroup,
} from "@lipy/web-ui/components/forms/elements";
import { Button } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import { CopyButton } from "@lipy/web-ui/components/ui/copy-button";
import { Form } from "@lipy/web-ui/components/ui/form";
import { Label } from "@lipy/web-ui/components/ui/label";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import {
	Link,
	createFileRoute,
	useRouter,
	useSearch,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import QRCode from "react-qr-code";
import z from "zod";

export const Route = createFileRoute("/register")({
	component: RouteComponent,
	validateSearch: z.object({
		step: z.number().int().min(1).default(1).catch(1),
	}),
});

const storeTypes = ["grocery", "medical", "restaurant", "cafe", "hardware"];
const step1 = {
	title: "Store Information",
	description: "Tell us about your store",
	children: (
		<>
			<FormInput
				label="Store Name"
				name="name"
				placeholder="Your Full Name"
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
				opts={storeTypes.map((s) => ({ label: s, value: s }))}
				required
				type="single"
			/>
		</>
	),
};
const step2 = {
	title: "Store Address",
	description: "Tell us about your store.",
	children: (
		<>
			<FormInput label="Building / Flat / Shop no. " name="line1" required />
			<FormInput label="Locality Area / Land mark" name="line2" required />
			<div className="grid md:grid-cols-2 md:gap-4">
				<FormInput label="City" name="city" required />
				<FormInput label="Pin code" name="zipcode" required />
			</div>
			<div className="grid md:grid-cols-2 md:gap-4">
				<FormInput label="State" name="state" required />

				<FormInput label="Country" name="country" required />
			</div>
		</>
	),
};

const step3 = {
	title: "Payments Information",
	description: "Tell us your UPI ID.",
	children: (
		<div className="">
			<FormInput
				label="Store UPI ID"
				name="phone"
				placeholder="Your Store Phone Number"
				required
			/>
			<div className="md:bg-accent/50 rounded p-0 md:p-4">
				<div className="p-8 bg-card border drop-shadow-xs rounded w-fit flex flex-col justify-center items-center space-y-4 m-auto">
					<img src="/assets/upi-bhim.svg" alt="Upi" width={150} />
					<QRCode
						value={`upi://pay?pa=kundanmbhosale@okhdfcbank&pn=Kundan%20Bhosale`}
						level="H"
					/>
					<div className="text-center">
						<Label className="flex items-center gap-1 text-muted-foreground">
							kundanmbhosale@okhdfcbank
							<CopyButton value="upi://pay?pa=kundanmbhosale@okhdfcbank&pn=Kundan%20Bhosale" />
						</Label>
						<p className="text-base">Kundan Bhosale</p>
					</div>
				</div>
			</div>
			{/* upi://pay?pa=kundanmbhosale@okhdfcbank&pn=Kundan%20Bhosale&aid=uGICAgMCKitvebQ */}
		</div>
	),
};
function RouteComponent() {
	return <MultiStepLayout steps={[step1, step2, step3]} />;
}

type MultiStepLayoutProps = {
	title: string;
	description: string;
	children: ReactNode;
};

function MultiStepLayout({ steps }: { steps: MultiStepLayoutProps[] }) {
	const { step = 1 } = useSearch({ strict: false });
	const router = useRouter();
	const { isMobile } = useViewport();
	const form = useForm({
		defaultValues: {},
	});
	const totalSteps = steps.length;

	const activeStep = steps[step - 1];

	const handleBack = () => {
		if (step === 1) return router.history.back();
		(router as any).navigate({
			search: (p: any) => ({ ...p, step: step - 1 }),
			replace: true,
		});
	};

	const onSubmit = () => {
		if (totalSteps === step) return;
		(router as any).navigate({
			search: (p: any) => ({ ...p, step: step + 1 }),
			replace: true,
		});
	};

	const Component = (
		<Form {...form}>
			<form
				className="bg-background/80 md:bg-background grid md:grid-cols-[minmax(300px,700px)_auto] h-screen overflow-auto"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="max-w-lg m-auto w-full min-h-screen flex flex-col overflow-auto">
					<Card className="w-full pt-8 pb-8 px-4 space-y-4 flex-1">
						<Button
							type="button"
							variant={"outline"}
							size={"icon"}
							disabled={step === 0}
							onClick={handleBack}
						>
							<ArrowLeft />
						</Button>
						<CardHeader>
							{/* <div className="flex justify-center items-center mb-4">
								<Link to={"/"}>
									<img
										src="/logo/ico.png"
										alt="Lipy"
										width={75}
										height={75}
										className="rounded-md"
									/>
								</Link>
							</div> */}
							<div className="text-center">
								<CardDescription>
									{step} of {totalSteps}
								</CardDescription>
								<CardDescription>{activeStep.description}</CardDescription>

								<CardTitle className="text-xl">{activeStep.title}</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="md:px-0 flex flex-col border-0 bg-background">
							{activeStep.children}
						</CardContent>
						<div className="gap-4 flex w-full lg:justify-end mt-auto">
							{!isMobile && (
								<Button
									onClick={handleBack}
									type="button"
									variant={"outline"}
									size={"icon-lg"}
									disabled={step === 0}
								>
									<ArrowLeft />
								</Button>
							)}
							<FormButton className="flex-1" size={"lg"}>
								{step === totalSteps ? "Submit" : "Next Step"}
							</FormButton>
						</div>
					</Card>
				</div>
				<div className="h-screen overflow-hidden fixed -z-10 md:z-0 md:sticky top-0">
					 
					<img
						src="/assets/store.jpg"
						alt="Store"
						className="size-full object-cover brightness-120 md:brightness-100"
					/>
				</div>
			</form>
		</Form>
	);
	return <Fragment key={step}>{Component}</Fragment>;
}
