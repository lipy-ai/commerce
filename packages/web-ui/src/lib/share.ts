// share.ts

export async function shareContent({
	title,
	text,
	url,
}: {
	title: string;
	text: string;
	url: string;
}): Promise<string> {
	if (!navigator.share) {
		return "Web Share API not supported in this browser.";
	}

	const shareData = { title, text, url };

	try {
		await navigator.share(shareData);
		return "Shared successfully!";
	} catch (err) {
		return `Error: ${(err as Error).message}`;
	}
}
