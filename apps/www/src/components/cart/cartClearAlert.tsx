import { loggedInCartApi } from "@lipy/lib/api";
import { useAPIMutation } from "@lipy/lib/utils/useQueryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@lipy/web-ui/components/ui/alert-dialog";
import { useCartStore } from "./store";

export function CartClearAlert({
  open,
  onOpenChange,
  setChangeAddress,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setChangeAddress: (value: boolean) => void;
}) {
  const { resetCart } = useCartStore();
  const deleteMutation = useAPIMutation(loggedInCartApi.index, "$delete", {
    onSuccess() {
      resetCart();
      setChangeAddress(true);
    },
  });

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({});
  };
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            There are items in your cart. Changing delivery address will clear
            your cart.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Change Address
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
