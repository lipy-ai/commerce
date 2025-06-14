import * as React from "react";

import { useUpload } from "@lipy/lib/hooks/use-upload";
import { createResizedImage } from "@lipy/web-ui/lib/resizer";
import { cn } from "@lipy/web-ui/lib/utils";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import CircularProgress from "./circular-progress";

export type SingleImageProps = {
	url?: string;
	alt?: string;
	accept?: string;
	referrerPolicy?: HTMLImageElement["referrerPolicy"];
	className?: string;
	onSuccess?: (data: ReturnType<typeof useUpload>["data"]) => void;
};

const SingleImage = (props: SingleImageProps) => {
	return (
		<div
			className={cn(
				"rounded-md relative bg-muted/40 border border-input flex justify-center items-center cursor-pointer pointer-events-auto hover:bg-muted aspect-square",
				props.className,
			)}
		>
			{props.url ? (
				<img
					src={props.url}
					alt={props.alt}
					referrerPolicy={(props.referrerPolicy as any) || undefined}
				/>
			) : (
				<Input {...props} />
			)}
		</div>
	);
};

const Input = ({ onSuccess, accept }: SingleImageProps) => {
	const [file, setFile] = React.useState<File | null>(null);
	const { status, progress, data } = useUpload({ file });

	React.useEffect(() => {
		if (status === "success" && data.url) {
			onSuccess?.(data);
			setFile(null);
		}
	}, [status, data]);

	const defaultMimes =
		"image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/webm,video/quicktime";

	const mimeTypes = accept || defaultMimes;

	const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return toast.error("File not found");

		createResizedImage(
			file, // File object
			800, // maxWidth
			800, // maxHeight
			"jpeg", // compressFormat
			80, // quality
			0, // rotation
			(resized) => {
				if (!resized) return toast.error("Failed to resize...");
				setFile(resized as File);
			},
			"file", // outputType
			300, // minWidth (optional)
			300, // minHeight (optional)
		);
	};

	return (
		<div>
			<input
				id="upload-input"
				type={"file"}
				accept={mimeTypes}
				className={cn("opacity-0 absolute size-full")}
				onChange={onFileSelect}
			/>
			{status === "pending" ? (
				<CircularProgress percentage={progress} />
			) : (
				<Plus />
			)}

			<label htmlFor="upload-input" className="sr-only">
				Upload Image
			</label>
		</div>
	);
};

SingleImage.displayName = "SingleImage";

export { SingleImage };
