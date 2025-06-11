import { Skeleton } from "@lipy/web-ui/components/ui/skeleton";

function VerticalListSkeleton({ count }: { count: number }) {
	return (
		<div className="grid gap-8">
			{[...Array(count || 5)].map((m) => (
				<Skeleton key={m} className="h-14" />
			))}
		</div>
	);
}

export default VerticalListSkeleton;
