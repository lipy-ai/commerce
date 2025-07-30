import { useCartStore } from "@/components/cart/store";
import {
  DrawerDialogHeader,
  DrawerDialogSwitcher,
  DrawerDialogTitle,
} from "@lipy/web-ui/components/custom-ui/drawerDialogSwitcher";
import { DashboardHeader } from "@lipy/web-ui/components/layouts/dashboard";
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
import { Button } from "@lipy/web-ui/components/ui/button";
import { toast } from "@lipy/web-ui/components/ui/sonner";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, ChevronRight, Images, X } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute(
  "/(default)/(store)/$storeHandle/order/(pharmacy)/new"
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [openOptions, setOpenOptions] = useState(false);
  const [openRemoveImagesAlert, setOpenRemoveImagesAlert] = useState(false);
  const { uploadedImages, setUploadedImages } = useCartStore();
  const navigate = Route.useNavigate();
  const { storeHandle } = Route.useParams();

  return (
    <>
      <DashboardHeader title="Upload prescription" />
      <div className="mb-20">
        {uploadedImages.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 p-4">
              {uploadedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Prescription ${index + 1}`}
                    className="object-cover w-40 h-48 border rounded-xl"
                  />
                  <div>
                    <Button
                      variant={"outline"}
                      className="absolute top-2 right-2 rounded-full bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                      size="icon-sm"
                      onClick={() => {
                        setUploadedImages(
                          uploadedImages.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {uploadedImages.length > 0 && uploadedImages.length < 10 && (
          <Button
            className="text-secondary font-medium w-full"
            variant="ghost"
            onClick={() => setOpenOptions(true)}
          >
            Upload more prescriptions
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center justify-center h-full m-auto">
        {uploadedImages.length === 0 && (
          <img
            src="/assets/prescription.svg"
            alt="prescription"
            className="size-64 object-cover pl-10 -mt-16"
          />
        )}
      </div>

      <div className="fixed bottom-0 w-full bg-card p-4 flex items-center gap-10 justify-center">
        <p className="text-base font-medium hidden lg:block">
          We will review your prescriptions and arrange your medicines
        </p>
        <Button
          className="w-full lg:w-fit"
          onClick={() => {
            if (uploadedImages.length === 0) setOpenOptions(true);
            else {
              navigate({
                to: "/$storeHandle/order/checkout",
                params: {
                  storeHandle: storeHandle,
                },
              });
            }
          }}
        >
          {uploadedImages.length > 0
            ? "Proceed to order"
            : "Upload Prescription"}
        </Button>
      </div>

      {openOptions && (
        <OptionsDrawer open={openOptions} onOpenChange={setOpenOptions} />
      )}
      {openRemoveImagesAlert && (
        <RemoveImagesAlert
          open={openRemoveImagesAlert}
          onOpenChange={setOpenRemoveImagesAlert}
        />
      )}
    </>
  );
}

function OptionsDrawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setUploadedImages } = useCartStore();

  const triggerFileInput = (options?: { capture?: boolean }) => {
    const currentImages = useCartStore.getState().uploadedImages;
    const maxImages = 10;
    const remainingSlots = maxImages - currentImages.length;

    if (remainingSlots <= 0) {
      toast.info(`You can upload up to ${maxImages} images only.`);
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = true;

    // If capture mode requested, add attribute
    if (options?.capture) {
      input.setAttribute("capture", "environment");
    }

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const selectedFiles = Array.from(target.files);
        const allowedFiles = selectedFiles.slice(0, remainingSlots);

        setUploadedImages([...currentImages, ...allowedFiles]);

        if (selectedFiles.length > allowedFiles.length) {
          toast.info(
            `Only ${remainingSlots} image${remainingSlots > 1 ? "s" : ""} can be added.`
          );
        }
      }
      props.onOpenChange(false);
    };

    input.click();
  };

  return (
    <div>
      <DrawerDialogSwitcher open={props.open} onOpenChange={props.onOpenChange}>
        <DrawerDialogHeader>
          <DrawerDialogTitle>Upload prescriptions</DrawerDialogTitle>
        </DrawerDialogHeader>

        <div className="cursor-pointer divide-y divide-dashed bg-card rounded-xl px-2">
          <div
            className="flex items-center justify-between py-4"
            onClick={() => triggerFileInput({ capture: true })}
          >
            <div className="flex items-center gap-4">
              <Camera className="size-5 flex-shrink-0" />
              <p className="font-medium text-sm">Capture from camera</p>
            </div>
            <ChevronRight className="size-4" />
          </div>
          <div
            className="flex items-center justify-between py-4"
            onClick={() => triggerFileInput()}
          >
            <div className="flex items-center gap-4">
              <Images className="size-5 flex-shrink-0" />
              <p className="font-medium text-sm">Upload from gallery</p>
            </div>
            <ChevronRight className="size-4" />
          </div>
        </div>
      </DrawerDialogSwitcher>
    </div>
  );
}

function RemoveImagesAlert({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
