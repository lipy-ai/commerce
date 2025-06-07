import { apiClient } from "@lipy/lib/api";
import {
	apiQueryOptions,
	useAPIMutation,
	useAPIQuery,
} from "@lipy/lib/utils/queryClient.js";
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/demo/tanstackMutation")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();
	//   console.log(queryClient.);
	const updateMutation = useAPIMutation(apiClient.v1.address, "$post", {
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: apiQueryOptions(apiClient.v1.address, "$get", {}).queryKey,
			});
		},
	});

	const deleteMutation = useAPIMutation(
		apiClient.v1.address[":id"],
		"$delete",
		{
			onSuccess() {
				queryClient.invalidateQueries({
					queryKey: apiQueryOptions(apiClient.v1.address, "$get", {}).queryKey,
				});
			},
		},
	);

	const updateHandle = () => {
		toast.promise(
			updateMutation.mutateAsync({
				json: {
					name: "string",
					country: "string",
					tag: "home",
					line1: "string",
					line2: "string",
					city: "string",
					state: "string",
					postalCode: "string",
					phone: "",
					lat: 0,
					lng: 0,
				},
			}),
			{
				success: "Success",
				error: "Error",
				loading: "Saving",
			},
		);
	};

	const deleteHandle = (id: string) => {
		toast.promise(
			deleteMutation.mutateAsync({
				param: { id },
			}),
			{
				success: "Success",
				error: "Error",
				loading: "Deleting",
			},
		);
	};

	const { data } = useAPIQuery(apiClient.v1.address, "$get", {});
	return (
		<div className="p-8">
			<div>
				<Button onClick={updateHandle}>Add</Button>

				<div className="space-y-4 my-4">
					{data?.map((d, i) => (
						<div key={i} className="flex gap-2">
							<p key={i} className="p-2 bg-primary">
								{d.id}
							</p>
							<Button onClick={() => deleteHandle(d.id)} variant={"outline"}>
								Remove
							</Button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
