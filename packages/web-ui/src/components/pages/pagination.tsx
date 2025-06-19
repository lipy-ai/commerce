import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { Button } from "../ui/button";

export function Pagination({
	page,
	totalPages,
	totalResults,
}: {
	page: number;
	totalPages: number;
	totalResults: number;
}) {
	const navigate = useNavigate();
	const onPrev = () => {
		navigate({
			search: {
				page: page < 1 ? 0 : page - 1,
			} as any,
		});
	};
	const onNext = () => {
		navigate({
			search: {
				page: page < totalPages ? page + 1 : totalPages,
			} as any,
		});
	};

	return (
		<div className="text-center md:text-start flex justify-between gap-8 p-4 md:p-0 items-center">
			<div className="hidden md:block">
				<span className="text-muted-foreground flex gap-1 items-center">
					<Info className="size-4" />
					{totalResults} results found
				</span>
			</div>
			<div className="flex justify-between md:justify-end  gap-4 flex-1">
				<div className="flex items-center">
					<span className="text-muted-foreground">
						Page {page} of {totalPages}
					</span>
				</div>
				<div className="flex gap-4">
					<Button
						variant={"outline"}
						size={"icon-sm"}
						onClick={onPrev}
						disabled={page === 1}
					>
						<ArrowLeft />
					</Button>

					<Button
						variant={"outline"}
						size={"icon-sm"}
						onClick={onNext}
						disabled={page === totalPages}
					>
						<ArrowRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
