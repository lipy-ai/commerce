import {
	DrawerDialogClose,
	DrawerDialogFooter,
	DrawerDialogHeader,
	DrawerDialogSwitcher,
	DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { Form } from "@lipy/web-ui/components/ui/form";

import {
	FormButton,
	FormImage,
	FormInput,
	FormTextarea,
} from "@lipy/web-ui/components/forms/elements";
import type { InferRequestType } from "hono";

import { apiClient } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import { type ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { useCategoryInvalidate } from "./-hook-invalidate";
type Request = InferRequestType<typeof apiClient.v1.admin.category.$patch>;
type Values = Request["json"];

export function CategoryFormEdit({
	type,
	data,
	children,
}: {
	data?: Partial<Values>;
	type: "create" | "update";
	children: ReactNode;
}) {
	const [open, setOpen] = useState(false);
	const { invalidate } = useCategoryInvalidate();

	const mutation = useAPIMutation(apiClient.v1.admin.category, "$patch", {
		onMutate: () => {
			setOpen(false);
		},
		onError: () => {
			invalidate();
		},
	});

	const createMutation = useAPIMutation(apiClient.v1.admin.category, "$post", {
		onSuccess: () => {
			setOpen(false);
		},
		onError: () => {
			invalidate();
		},
	});

	const defaultValues: Values = {
		id: data?.id || "",
		title: data?.title || "",
		summary: data?.summary || "",
		image: data?.image || "",
	};

	const form = useForm({
		defaultValues,
	});

	const onSubmit = async (body: typeof defaultValues) => {
		if (type === "create") {
			return await createMutation.mutateAsync({ json: body });
		}
		await mutation.mutateAsync({ json: body });
	};

	return (
		<>
			<DrawerDialogSwitcher
				className="sm:max-w-xl"
				open={open}
				onOpenChange={setOpen}
				trigger={children}
			>
				<DrawerDialogHeader>
					<DrawerDialogTitle>
						{type === "create" ? "Create Category" : "Edit Category"}
					</DrawerDialogTitle>
				</DrawerDialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="grid">
						<FormImage
							label="Image"
							name="image"
							wrapperClassName="size-23 mb-4"
						/>
						<FormInput
							label="Title"
							name="title"
							placeholder="Category Title"
						/>

						<FormTextarea
							label="Summary"
							name="summary"
							placeholder="Write a brief."
						/>

						<DrawerDialogFooter>
							<DrawerDialogClose />
							<FormButton>Save Changes</FormButton>
						</DrawerDialogFooter>
					</form>
				</Form>
			</DrawerDialogSwitcher>
		</>
	);
}
