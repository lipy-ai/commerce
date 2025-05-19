import { useAPIMutation } from "@lipy/lib/utils/queryClient"
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
} from "../ui/alert-dialog"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Trash } from "lucide-react"
import { apiClient } from "@lipy/lib/api";
import { toast } from "sonner";

export function DeleteAddress(
    addressId
) {
    const mutation = useAPIMutation(apiClient.v1.address, "$delete");

    const handleDeleteAddress = ()=>{
      toast.promise(
        mutation.mutateAsync({
          json: {
            id: addressId,
          },
        }),
        {
          success: "Address deleted successfully",
          error: "Something went wrong",
          loading: "Deleting address",
        }
      )
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
         <Avatar className="w-8 h-8">
                      <AvatarFallback>
                    <Trash className="size-4 text-muted-foreground flex-shrink-0" />
                  </AvatarFallback>
                    </Avatar>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This address will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction >Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
