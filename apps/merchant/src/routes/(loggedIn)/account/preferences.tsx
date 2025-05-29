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

import { FormSwitch } from "@lipy/web-ui/components/forms/elements";
import { Button } from "@lipy/web-ui/components/ui/button";
import { Form } from "@lipy/web-ui/components/ui/form";
import { Input } from "@lipy/web-ui/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
} from "@lipy/web-ui/components/ui/table";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, MoreVertical, Search } from "lucide-react";
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
	const { isMobile } = useViewport();

	const form = useForm({
		// resolver: zodResolver(),
		defaultValues: {},
	});

	return (
		<Form {...form}>
			<DashboardHeader title="Preferences" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 lg:p-4 max-w-4xl"
			>
				<div className="grid divide-y lg:gap-4">
					<div className="bg-background lg:border">
						<h1 className="text-lg font-medium px-4 p-4 flex gap-2 items-center">
							Notifications
						</h1>
						<div className="divide-y border-y">
							{Object.keys(notification).map((k) => {
								const v = notification[k as keyof typeof notification];
								return (
									<div key={k} className="flex items-center px-4 gap-4">
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
						<div className="p-4">
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
