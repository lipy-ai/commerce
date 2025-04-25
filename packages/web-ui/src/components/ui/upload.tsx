import * as React from "react";

import { cn } from "@web-ui/lib/utils";
import { Plus } from "lucide-react";
import { useUpload } from "@repo-lib/hooks/use-upload";
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  fileType: Parameters<typeof useUpload>["0"]["type"];
}

const InputImage = React.forwardRef<HTMLInputElement, Omit<InputProps, "type">>(
  ({ className, fileType, onChange, onBlur, ...props }, ref) => {
    const [file, setFile] = React.useState<File | null>(null);

    const upload = useUpload({ file, type: fileType });

    // console.log(upload);

    return (
      <div
        className={cn(
          "rounded-md relative bg-muted/40 border size-20 flex justify-center items-center cursor-pointer pointer-events-auto hover:bg-muted"
        )}
      >
        <input
          type={"file"}
          className={cn("opacity-0 absolute size-full")}
          ref={ref}
          onChange={(e) => e.target.files && setFile(e.target.files[0])}
          {...props}
        />
        <Plus />
        <label htmlFor={props.id} className="sr-only">
          Upload Image
        </label>
      </div>
    );
  }
);
InputImage.displayName = "InputImage";

export { InputImage };
