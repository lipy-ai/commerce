import { apiClient } from "@lipy/lib/api";
import { apiQueryOptions, useAPIMutation } from "@lipy/lib/utils/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import type { FC } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";

interface DeleteAddressProps {
	addressId: string;
}

export const DeleteAddress: FC<DeleteAddressProps> = ({ addressId }) => {
	const navigator = useNavigate();
	const queryClient = useQueryClient();

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
	const handleDeleteAddress = () => {
		toast.promise(deleteMutation.mutateAsync({ param: { id: addressId } }), {
			loading: "Deleting address...",
			success: () => {
				navigator({ to: "/account/addresses", replace: true });
				return "Address deleted successfully";
			},
			error: "Something went wrong",
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Avatar className="w-8 h-8 cursor-pointer">
					<AvatarFallback>
						<Trash className="size-4 text-muted-foreground" />
					</AvatarFallback>
				</Avatar>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This address will be permanently
						deleted.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleDeleteAddress}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
