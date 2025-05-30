type CompressFormat = "jpeg" | "png" | "webp";
type OutputType = "base64" | "blob" | "file";

interface Size {
	height: number;
	width: number;
}

export function changeHeightWidth(
	height: number,
	maxHeight: number,
	width: number,
	maxWidth: number,
	minWidth?: number | null,
	minHeight?: number | null,
): Size {
	let h = height;
	let w = width;
	if (w > maxWidth) {
		h = Math.round((height * maxWidth) / width);
		w = maxWidth;
	}
	if (h > maxHeight) {
		h = Math.round((width * maxHeight) / height);
		w = maxHeight;
	}
	if (minWidth && w < minWidth) {
		h = Math.round((height * minWidth) / width);
		w = minWidth;
	}
	if (minHeight && h < minHeight) {
		h = Math.round((width * minHeight) / height);
		w = minHeight;
	}
	return { height: h, width: w };
}

export function resizeAndRotateImage(
	image: HTMLImageElement,
	maxWidth: number,
	maxHeight: number,
	minWidth: number | null,
	minHeight: number | null,
	compressFormat: CompressFormat = "jpeg",
	quality = 100,
	rotation = 0,
): string {
	const qualityDecimal = quality / 100;
	const canvas = document.createElement("canvas");

	let width = image.width;
	let height = image.height;

	const newSize = changeHeightWidth(
		height,
		maxHeight,
		width,
		maxWidth,
		minWidth,
		minHeight,
	);

	if (rotation && (rotation === 90 || rotation === 270)) {
		canvas.width = newSize.height;
		canvas.height = newSize.width;
	} else {
		canvas.width = newSize.width;
		canvas.height = newSize.height;
	}

	width = newSize.width;
	height = newSize.height;

	const ctx = canvas.getContext("2d")!;
	ctx.fillStyle = "rgba(0, 0, 0, 0)";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	if (ctx.imageSmoothingEnabled && ctx.imageSmoothingQuality) {
		ctx.imageSmoothingQuality = "high";
	}

	ctx.save();
	if (rotation) {
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate((rotation * Math.PI) / 180);
		ctx.translate(-canvas.width / 2, -canvas.height / 2);
	}
	ctx.drawImage(image, 0, 0, width, height);
	ctx.restore();

	return canvas.toDataURL(`image/${compressFormat}`, qualityDecimal);
}

export function b64toByteArrays(
	b64Data: string,
	// contentType = "image/jpeg",
): Uint8Array[] {
	const sliceSize = 512;
	const cleanedData = b64Data.replace(
		/^data:image\/(png|jpeg|jpg|webp);base64,/,
		"",
	);
	const byteCharacters = atob(cleanedData);
	const byteArrays: Uint8Array[] = [];

	for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		const slice = byteCharacters.slice(offset, offset + sliceSize);
		const byteNumbers = new Array(slice.length)
			.fill(0)
			.map((_, i) => slice.charCodeAt(i));
		byteArrays.push(new Uint8Array(byteNumbers));
	}

	return byteArrays;
}

export function b64toBlob(b64Data: string, contentType = "image/jpeg"): Blob {
	const byteArrays = b64toByteArrays(b64Data);
	return new Blob(byteArrays as any, {
		type: contentType,
		// lastModified: Date.now(),
	});
}

export function b64toFile(
	b64Data: string,
	fileName: string,
	contentType = "image/jpeg",
): File {
	const byteArrays = b64toByteArrays(b64Data);
	return new File(byteArrays as any, fileName, {
		type: contentType,
		lastModified: Date.now(),
	});
}

export function createResizedImage(
	file: File,
	maxWidth: number,
	maxHeight: number,
	compressFormat: CompressFormat,
	quality: number,
	rotation: number,
	responseUriFunc: (result: string | Blob | File) => void,
	outputType: OutputType = "base64",
	minWidth: number | null = null,
	minHeight: number | null = null,
): void {
	const reader = new FileReader();

	if (!file) {
		throw new Error("File Not Found!");
	}

	if (file.type && !file.type.includes("image")) {
		throw new Error("File is NOT an image!");
	}

	reader.readAsDataURL(file);

	reader.onload = () => {
		const image = new Image();
		image.src = reader.result as string;

		image.onload = () => {
			const resizedDataUrl = resizeAndRotateImage(
				image,
				maxWidth,
				maxHeight,
				minWidth,
				minHeight,
				compressFormat,
				quality,
				rotation,
			);
			const contentType = `image/${compressFormat}`;

			const handleFileOutput = () => {
				const baseName = file.name.replace(/\.(png|jpeg|jpg|webp)$/i, "");
				const newFileName = `${baseName}.${compressFormat}`;
				responseUriFunc(b64toFile(resizedDataUrl, newFileName, contentType));
			};

			switch (outputType) {
				case "blob":
					responseUriFunc(b64toBlob(resizedDataUrl, contentType));
					break;
				case "file":
					handleFileOutput();
					break;
				case "base64":
					responseUriFunc(resizedDataUrl);
					break;
				default:
					responseUriFunc(resizedDataUrl);
					break;
			}
		};
	};

	reader.onerror = (error) => {
		throw new Error(error.toString());
	};
}
