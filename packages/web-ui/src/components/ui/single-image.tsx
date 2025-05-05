import * as React from "react";

import { cn } from "@web-ui/lib/utils";
import { Plus } from "lucide-react";
import { useUpload } from "@repo-lib/hooks/use-upload";
import CircularProgress from "./circular-progress";

type SingleImageProps = {
  fileType: Parameters<typeof useUpload>["0"]["type"];
  className?: string;
  onSuccess?: (data: ReturnType<typeof useUpload>["data"]) => void;
};

const SingleImage = ({ className, fileType, onSuccess }: SingleImageProps) => {
  const [file, setFile] = React.useState<File | null>(null);

  const { status, progress, data } = useUpload({ file, type: fileType });

  React.useEffect(() => {
    if (status === "success" && data.url) {
      onSuccess && onSuccess(data);
      setFile(null);
    }
  }, [status, data]);

  return (
    <div
      className={cn(
        "rounded-md relative bg-muted/40 border flex justify-center items-center cursor-pointer pointer-events-auto hover:bg-muted aspect-square",
        className
      )}
    >
      <div>
        <input
          type={"file"}
          className={cn("opacity-0 absolute size-full")}
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
        />
        {status === "pending" ? (
          <CircularProgress percentage={progress} />
        ) : (
          <Plus />
        )}

        <label className="sr-only">Upload Image</label>
      </div>
    </div>
  );
};
SingleImage.displayName = "SingleImage";

export { SingleImage };
