import { useDeleteUpload, useUpload } from "@lipy/lib/hooks/use-upload";
import { createResizedImage } from "@lipy/web-ui/lib/resizer";
import { cn } from "@lipy/web-ui/lib/utils";
import { Plus, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import CircularProgress from "../ui/circular-progress";
export const defaultImgMimes =
  "image/jpeg,image/png,image/webp,image/heic,image/heif";

export type SingleImageProps = {
  url?: string;
  alt?: string;
  accept?: string;
  referrerPolicy?: HTMLImageElement["referrerPolicy"];
  wrapperClassName?: string;
  imageClassName?: string;
  onSuccess?: (data: ReturnType<typeof useUpload>["data"]) => void;
  onDelete?: (url: string) => void;
};

const SingleImage = (
  props: SingleImageProps & React.ComponentProps<"input">
) => {
  const { deleteFile } = useDeleteUpload({
    onSuccess: () => {
      return props.url && props.onDelete?.(props.url);
    },
  });

  return (
    <div
      className={cn(
        " relative bg-card border border-dashed rounded-lg flex justify-center items-center cursor-pointer pointer-events-auto aspect-square",
        props.wrapperClassName
      )}
    >
      {props.url && (
        <Button
          type={"button"}
          variant={"outline"}
          size={"icon-sm"}
          className="absolute -right-2 -top-2 flex transition-all ease-in-out"
          onClick={() => deleteFile(props.url!)}
        >
          <X />
        </Button>
      )}
      {!props.multiple && props.url ? (
        <img
          src={props.url}
          alt={props.alt}
          referrerPolicy={(props.referrerPolicy as any) || undefined}
          className={cn(
            "object-contain overflow-hidden size-full",
            props.imageClassName
          )}
        />
      ) : (
        <Input {...props} />
      )}
    </div>
  );
};

const Input = ({ onSuccess, accept }: SingleImageProps) => {
  const [file, setFile] = React.useState<File | null>(null);
  const { status, progress, data } = useUpload({ file });

  React.useEffect(() => {
    if (status === "success" && data.url) {
      onSuccess?.(data);
      setFile(null);
    }
  }, [status, data, onSuccess]);

  const mimeTypes = accept || defaultImgMimes;

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("File not found");

    createResizedImage(
      file, // File object
      800, // maxWidth
      800, // maxHeight
      "webp", // compressFormat
      80, // quality
      0, // rotation
      (resized) => {
        if (!resized) return toast.error("Failed to resize...");
        setFile(resized as File);
      },
      "file", // outputType
      300, // minWidth (optional)
      300 // minHeight (optional)
    );
  };

  return (
    <div>
      <input
        id="upload-input"
        type={"file"}
        accept={mimeTypes}
        className={cn(
          "opacity-0 absolute left-0 top-0 size-full cursor-pointer"
        )}
        onChange={onFileSelect}
      />
      {status === "pending" ? (
        <CircularProgress percentage={progress} />
      ) : (
        <Plus />
      )}

      <label htmlFor="upload-input" className="sr-only">
        Upload Image
      </label>
    </div>
  );
};

SingleImage.displayName = "SingleImage";

export { SingleImage };
