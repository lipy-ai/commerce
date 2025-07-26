export const scrollToElementHorizontal = (id: string) => {
	if (!id) return;

	const target = document.querySelector(id);
	if (!target) return;

	const scrollContainer = findScrollableParent(target, "x");
	if (!scrollContainer) return;

	const targetRect = target.getBoundingClientRect();
	const containerRect = scrollContainer.getBoundingClientRect();

	const scrollLeft =
		scrollContainer.scrollLeft + (targetRect.left - containerRect.left);
	scrollContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });
};

const findScrollableParent = (
	el: Element,
	axis: "x" | "y",
): HTMLElement | null => {
	let current: HTMLElement | null = el.parentElement;
	while (current) {
		const overflow = getComputedStyle(current).overflowX;
		if (axis === "x" && (overflow === "auto" || overflow === "scroll")) {
			return current;
		}
		current = current.parentElement;
	}
	return null;
};
