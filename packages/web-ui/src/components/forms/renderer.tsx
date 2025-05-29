// @ts-ignore
// @ts-nocheck
"use client";

import { Fragment, useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button, type buttonVariants } from "@lipy/web-ui/components/ui/button";
import { Form } from "@lipy/web-ui/components/ui/form";


import { zodResolver } from "@hookform/resolvers/zod";
import ErrorPage from "@lipy/web-ui/components/pages/error";
import Loading from "@lipy/web-ui/components/ui/loading";
import { cn } from "@lipy/web-ui/lib/utils";
import type { ZodType } from "zod";


import { useFormStore } from "./store";
import type { FormElement } from "./types";

import { useViewport } from "@lipy/web-ui/contexts/viewport";
import type { VariantProps } from "class-variance-authority";

type FormStyle = {
	labelPos?: "top" | "left";
	submitBtn?: {
		pos?: {
			vertical?: "top" | "bottom";
			horizontal?: "left" | "right";
		};
		label?: string;
		variant?: VariantProps<typeof buttonVariants>["variant"];
		className?: string;
	};
	editBtn?: {



		
		label?: string;
	};
};
export type FormSchema<FormID = string, ElementsKey = string> = Array<{
	id: FormID;
	title: string;
	description: string;
	canSkip?: boolean;
	schema: ZodType<unknown, any, {}>;
	values: Record<string, any>;
	elements:
		| Array<Array<FormElement & { name: ElementsKey }>>
		| Array<FormElement & { name: ElementsKey }>;
	size?: "lg" | "default";
	style?: FormStyle;
}>;
export type FormAction = (action: {
	type: "submit" | "prev" | "skip" | "cancel";
	data?: Record<string, any>;
}) => Promise<void>;

export default function FormRender(props: {
	forms: FormSchema;
	onAction?: FormAction;
	onSubmit: (val: any) => Promise<void>;
	activeId?: string;
	isLoading?: boolean;
	error: any;
	resetError: () => void;
}) {
	const isMultiStep = props.forms.length > 1;
	const { actions, activeFormIdx } = useFormStore();
	const activeForm = props.forms[activeFormIdx];

	useEffect(() => {
		return () => actions.reset();
	}, []);

	useEffect(() => {
		const idx = props.forms.findIndex((f) => f.id === props.activeId);
		if (idx === -1) return;
		actions.setActiveFormIdx(idx);
	}, [props.activeId]);

	const onAction: FormAction = async (d) => {
		if (d.type === "prev" && activeFormIdx > 0) {
			return actions.setActiveFormIdx(activeFormIdx - 1);
		}

		if (activeForm && d.data) {
			actions.setFormData(
				isMultiStep
					? {
							[activeForm.id]: d.data,
						}
					: d.data,
			);
		}

		if (d.type === "submit") {
			activeFormIdx < props.forms.length - 1 &&
				actions.setActiveFormIdx(activeFormIdx + 1);

			if (activeFormIdx === props.forms.length - 1) {
				return await props.onSubmit(useFormStore.getState().data);
			}
		}
		if (!props.onAction) return;
		return await props.onAction(d);
	};

	// const isZodError = props?.error?.error?.name === "ZodError"

	if (!activeForm) return null;

	return (
		<div className="relative">
			{props.isLoading && (
				<Loading className="absolute top-0 left-0 size-full bg-background" />
			)}
			{props.error && (
				<ErrorPage
					className="absolute top-0 left-0 size-full bg-background"
					title={props.error?.error?.message?.toString() || undefined}
					message={props.error?.error?.cause?.toString() || undefined}
					reset={props.resetError}
				/>
			)}
			<div>
				<FormComp
					form={activeForm}
					onAction={onAction}
					isMultiStep={isMultiStep}
					totalForms={props.forms.length}
				/>
			</div>
		</div>
	);
}
function FormComp(props: {
	form: FormSchema[0];
	onAction: FormAction;
	isMultiStep: boolean;
	totalForms: number;
}) {
	const { isMobile } = useViewport();

	const activeFormIdx = useFormStore((s) => s.activeFormIdx);
	const form = useForm({
		values: props.form.values,
		resolver: zodResolver(props.form.schema),
	});

	const formState = form.formState;

	const s = props.form.style;

	const style = {
		labelPos: s?.labelPos || "top",
		submitBtn: {
			label: s?.submitBtn?.label || "Submit",
			variant: s?.submitBtn?.variant || "default",
			className: s?.submitBtn?.className || "",
		},
		editBtn: {
			label: s?.editBtn?.label || "Edit Information",
		},
	} satisfies FormStyle;

	const onSubmit = async (data: any) => {
		await props.onAction({ type: "submit", data });
	};

	const Btns = (
		<div className={cn("space-x-8 flex justify-between")}>
			{props.isMultiStep && (
				<div>
					{props.form.canSkip && (
						<Button
							disabled={formState.isSubmitting}
							className=""
							type="button"
							size={props.form.size}
							onClick={async () => props.onAction({ type: "skip" })}
						>
							Skip
						</Button>
					)}
				</div>
			)}
			<div className="space-x-8 flex">
				{props.isMultiStep && activeFormIdx > 0 && (
					<Button
						disabled={formState.isSubmitting}
						className=""
						type="button"
						variant={"outline"}
						size={props.form.size}
						onClick={async () => props.onAction({ type: "prev" })}
					>
						Previous
					</Button>
				)}
				<div className="fixed bottom-0 bg-background w-full p-4 flex justify-center pr-10">
					<Button
						className={cn(style.submitBtn.className)}
						type="submit"
						size={props.form.size}
						variant={style.submitBtn.variant}
						disabled={
							formState.isSubmitting ||
							!formState.isDirty ||
							!formState.isValid ||
							formState.isSubmitSuccessful
						}
					>
						{formState.isSubmitting
							? "Submitting"
							: props.totalForms - 1 === activeFormIdx
								? style.submitBtn.label
								: "Next"}
					</Button>
				</div>
			</div>
		</div>
	);

	return (
		<Form {...form}>
			<div className="space-y-8">
				<div className="flex justify-between">
					<div>
						{props.form.title && (
							<h1 className="text-xl font-semibold">{props.form.title}</h1>
						)}
						{props.form.description && (
							<p className="text-base text-muted-foreground">
								{props.form.description}
							</p>
						)}
					</div>
				</div>
				<form className="grid gap-8" onSubmit={form.handleSubmit(onSubmit)}>
					<div className="grid gap-6">
						{props.form.elements.map((f, i) => (
							<Fragment key={i}>
								{Array.isArray(f) ? (
									<div
										className={cn("grid gap-6")}
										style={{
											gridTemplateColumns: !isMobile
												? `repeat(${f.length}, 1fr)`
												: undefined,
										}}
									>
										{f.map((s, idx) => (
											<div key={idx}>
												<RenderFormElement
													formElement={{
														...s,
														style: { size: props.form.size },
													}}
													form={form}
													labelPos={style.labelPos}
												/>
											</div>
										))}
									</div>
								) : (
									<RenderFormElement
										formElement={{ ...f, style: { size: props.form.size } }}
										form={form}
										labelPos={style.labelPos}
									/>
								)}
							</Fragment>
						))}
					</div>
					{Btns}
				</form>
			</div>
		</Form>
	);
}
