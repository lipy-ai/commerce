import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";

function VerticalListSkeleton() {
	return (
		<div className="grid gap-8">
			{[...Array(5)].map((m) => (
				<Skeleton key={m} className="h-14" />
			))}
		</div>
	);
}

export default VerticalListSkeleton;
