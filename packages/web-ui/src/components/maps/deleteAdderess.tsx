import { loggedInAddressApi } from "@lipy/lib/api";
import {
  apiQueryOptions,
  useAPIMutation,
} from "@lipy/lib/utils/useQueryClient";
import { useQueryClient } from "@tanstack/react-query";
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
} from "../ui/alert-dialog";

interface DeleteAddressProps {
  addressId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DeleteAddress = (props: DeleteAddressProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useAPIMutation(loggedInAddressApi[":id"], "$delete", {
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: apiQueryOptions(loggedInAddressApi.index, "$get", {})
          .queryKey,
      });
    },
  });
  const handleDeleteAddress = () => {
    toast.promise(
      deleteMutation.mutateAsync({ param: { id: props.addressId } }),
      {
        loading: "Deleting address...",
        success: () => {
          props.onOpenChange?.(false);
          return "Address deleted successfully";
        },
        error: "Something went wrong",
      }
    );
  };

  return (
    <AlertDialog open={props.open} onOpenChange={props.onOpenChange}>
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
