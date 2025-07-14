import { env } from "@envClient";
import { apiClient } from "@lipy/lib/api";
import { useAuthSession } from "@lipy/lib/hooks/use-auth";
import { useAPIMutation, useAPIQuery } from "@lipy/lib/utils/useQueryClient";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@lipy/web-ui/components/ui/avatar";
import { Button, buttonVariants } from "@lipy/web-ui/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@lipy/web-ui/components/ui/card";
import Loading from "@lipy/web-ui/components/ui/loading";
import { cn } from "@lipy/web-ui/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import type { InferRequestType } from "hono";
import { ArrowRight, Check, CheckCircle, X, XCircle } from "lucide-react";

export const Route = createFileRoute("/accept-invitation/$id/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const sess = useAuthSession();
	const { data, isLoading, isError, error } = useAPIQuery(
		apiClient.v1.merchant.store.invitation[":id"],
		"$get",
		{ param: { id } },
	);

	const mutation = useAPIMutation(
		apiClient.v1.shops.invitation[":id"][":type"],
		"$post",
	);

	if (isLoading || sess.isPending) {
		return <Loading />;
	}
	if (isError) {
		throw new Error((error as any)?.data?.message as any);
	}

	const handleInvitation = async (
		type: InferRequestType<
			(typeof apiClient.v1.shops.invitation)[":id"][":type"]["$post"]
		>["param"]["type"],
	) => {
		await mutation.mutateAsync({ param: { type, id } });
	};

	return (
		<Card className="h-screen md:h-auto flex flex-col justify-center md:max-w-lg m-auto w-full text-center p-8">
			{mutation.isSuccess ? (
				mutation.variables?.param.type === "accept" ? (
					<>
						<CardHeader>
							<div className="flex flex-col items-center justify-center gap-4">
								<CheckCircle className="size-20" />
								<CardTitle>Store Invitation Accepted!</CardTitle>
								<CardDescription className="text-balance">
									You have accepted to join store{" "}
									<span className="capitalize">({data?.storeName})</span> as
									role{" "}
									<span className="">({data?.role?.replaceAll("_", " ")})</span>
									.
								</CardDescription>
								<br />
							</div>
						</CardHeader>
						<CardFooter>
							<Link
								to={"/"}
								className={cn(buttonVariants({}), "w-full")}
								reloadDocument
							>
								Go to Shop <ArrowRight />
							</Link>
						</CardFooter>
					</>
				) : (
					<>
						<CardHeader>
							<div className="flex flex-col items-center justify-center gap-4">
								<XCircle className="size-20" />
								<CardTitle>Store Invitation Rejected!</CardTitle>
								<CardDescription className="text-balance">
									You have rejected to join store{" "}
									<span className="capitalize">({data?.storeName})</span> as
									role{" "}
									<span className="">({data?.role?.replaceAll("_", " ")})</span>
									.
								</CardDescription>
								<br />
							</div>
						</CardHeader>
						<CardFooter>
							<a
								href={env.WEB_URL}
								className={cn(buttonVariants({}), "w-full")}
							>
								Go to home <ArrowRight />
							</a>
						</CardFooter>
					</>
				)
			) : (
				<>
					<CardHeader>
						<div className="flex flex-col items-center justify-center gap-4">
							<Avatar className="size-24">
								<AvatarImage src={data?.storeImage || ""} />
								<AvatarFallback className="uppercase text-2xl">
									{data?.storeName?.[0] || "A"}
								</AvatarFallback>
							</Avatar>
							<CardTitle>Store Invitation</CardTitle>
							<CardDescription className="text-balance">
								You have been invited to join store{" "}
								<span className="capitalize">({data?.storeName})</span> as role{" "}
								<span className="">({data?.role?.replaceAll("_", " ")})</span>.
								This invitation will expire within 48 hours.
							</CardDescription>
							<br />
						</div>
					</CardHeader>
					<CardFooter className="gap-4 grid md:grid-cols-2  w-full">
						<Button
							variant={"outline"}
							className="w-full"
							onClick={() => handleInvitation("reject")}
							disabled={mutation.isPending}
						>
							<X /> Reject
						</Button>
						<Button
							className="w-full"
							onClick={() => handleInvitation("accept")}
							disabled={mutation.isPending}
						>
							<Check /> Accept
						</Button>
					</CardFooter>
				</>
			)}
		</Card>
	);
}
