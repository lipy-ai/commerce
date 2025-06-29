import { authClient } from "@lipy/lib/providers/auth";
import { useViewport } from "@lipy/web-ui/contexts/viewport";
import { cn } from "@lipy/web-ui/lib/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	FormButton,
	FormImage,
	FormInputWithAnimatedLabel,
} from "../forms/elements";
import { DashboardHeader } from "../layouts/dashboard";
import { Form } from "../ui/form";
import { Spinner } from "../ui/spinner";

export default function UserProfile() {
	const { data, isPending } = authClient.useSession();
	const { isMobile } = useViewport();

	const defaultValues = {
		image: data?.user.image,
		name: data?.user.name,
		email: data?.user.email,
	};

	const form = useForm({
		// resolver: zodResolver(),
		defaultValues,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		data?.user && form.reset({ ...data?.user });
	}, [data]);

	const onSubmit = async (data: typeof defaultValues) => {
		await authClient.updateUser({ name: data.name }).then((r) => {
			if (r.error) {
				toast.error("Failed to update user");
				throw r.error;
			}

			return r.data;
		});
	};

	if (isPending) return <Spinner />;

	return (
		<Form {...form}>
			<DashboardHeader title="My Profile" />

			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="p-4 lg:p-8 max-w-4xl "
			>
				<div className="space-y-10">
					<FormImage
						name="image"
						label="Image"
						wrapperClassName="size-24 mx-auto"
						imageClassName="rounded-full"
						alt="Profile image"
						referrerPolicy="no-referrer"
					/>

					<FormInputWithAnimatedLabel
						name="name"
						label="Name"
						placeholder="John Doe"
						wrapperClassName="my-6"
					/>
					<FormInputWithAnimatedLabel
						type="email"
						name="email"
						label="Email"
						placeholder="jhon@example.com"
						wrapperClassName="my-6"
						readOnly
					/>
				</div>

				<div
					className={cn(
						isMobile ? "fixed bg-card bottom-0 left-0 right-0 w-full p-4" : "",
					)}
				>
					<FormButton className="w-full lg:w-fit">Update profile</FormButton>
				</div>
			</form>
		</Form>
	);
}
