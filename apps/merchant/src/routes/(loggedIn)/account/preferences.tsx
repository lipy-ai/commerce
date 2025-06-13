import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";

import {
	CardDescription,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";

import { FormSwitch } from "@lipy/web-ui/components/forms/elements";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form } from "@lipy/web-ui/components/ui/form";

import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/(loggedIn)/account/preferences")({
	component: RouteComponent,
});

const notification = {
	communication: {
		name: "Communication",
		desc: "Receive emails about your account activity.",
	},
	marketing: {
		name: "Marketing",
		desc: "Receive emails about your account activity.",
	},
	social: {
		name: "Social",
		desc: "Receive emails about your account activity.",
	},
	security: {
		name: "Security",
		desc: "Receive emails about your account activity.",
	},
};

function RouteComponent() {
	const onSubmit = async (body: any) => {
		console.log(body);
	};
	// const { isMobile } = useViewport();

	const form = useForm({
		// resolver: zodResolver(),
		defaultValues: {},
	});

	return (
		<Form {...form}>
			<DashboardHeader title="Preferences" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 p-4 max-w-4xl"
			>
				<div className="grid lg:gap-4">
					<div className="bg-background">
						<h1 className="text-lg font-medium py-4 flex gap-2 items-center">
							Notifications
						</h1>
						<div className="divide-y border-y">
							{Object.keys(notification).map((k) => {
								const v = notification[k as keyof typeof notification];
								return (
									<div key={k} className="flex items-center gap-4">
										<CardHeader className="flex-1 p-0">
											<CardTitle className="text-base">{v.name}</CardTitle>
											<CardDescription>{v.desc}</CardDescription>
										</CardHeader>
										<div className="p-4">
											<FormSwitch name={k} />
										</div>
									</div>
								);
							})}
						</div>
						<div className="py-4">
							<Button className="" disabled={!form.formState.isDirty}>
								Save Changes
							</Button>
						</div>
					</div>
				</div>
			</form>
		</Form>
	);
}
