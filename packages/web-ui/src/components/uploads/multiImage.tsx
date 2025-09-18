import { useDeleteUpload, useUpload } from "@lipy/lib/hooks/use-upload";
import { createResizedImage } from "@lipy/web-ui/lib/resizer";
import { cn } from "@lipy/web-ui/lib/utils";
import { Plus, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import CircularProgress from "../ui/circular-progress";
import Loading from "../ui/loading";
import { defaultImgMimes } from "./image";

export type MultiImageProps = {
  onChange: (v: string[]) => void;
};

export default function MultiImage({
  urls,
  setUrls,
}: {
  urls: string[];
  setUrls: (v: string[]) => void;
}) {
  const [files, setFiles] = React.useState<
    Array<{ url?: string; file?: File }>
  >(urls?.map((c) => ({ url: c })) || []);

  const mimeTypes = defaultImgMimes;

  //   useEffect(() => {
  //     setFiles((prev) => {
  //       const merged = [...prev];
  //       for (const url of urls) {
  //         if (!merged.some((f) => f.url === url)) {
  //           merged.push({ url });
  //         }
  //       }
  //       return merged;
  //     });
  //   }, []);

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fs = e.target.files || [];

    const resizedFiles: typeof files = [];

    for (const file of fs) {
      if (!file) return toast.error("File not found");

      if (resizedFiles.length + files.length >= 10) {
        return toast.error("Max 10 files allowed.");
      }

      try {
        const resizedFile = await new Promise<File>((resolve, reject) =>
          createResizedImage(
            file,
            800,
            800,
            "webp",
            80,
            0,
            (resized) => {
              if (!resized) reject(new Error("Resize failed"));
              else resolve(resized as File);
            },
            "file",
            300,
            300
          )
        );

        resizedFiles.push({ file: resizedFile });
      } catch (err) {
        toast.error(`Failed to resize ${file.name}`);
      }
    }

    setFiles((f) => [...f, ...resizedFiles]);
  };

  const handleSuccess = (s: { url?: string }) => {
    if (!s.url) return;
    const newUrls = [...urls];
    if (!newUrls.includes(s.url)) {
      newUrls.push(s.url);
    }
    setUrls(newUrls);

    setFiles((prev) =>
      prev?.map((f) =>
        f.file && !f.url && !f.url?.startsWith("http")
          ? { ...f, url: s.url }
          : f
      )
    );
  };

  const handleRemove = (index: number, url?: string) => {
    setUrls(urls.filter((u, i) => i !== index && u !== url));
    setFiles((prev) =>
      prev.filter((_, i) => i !== index && (url ? prev[i].url !== url : true))
    );
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {files.length < 10 && (
        <div className="rounded-lg relative bg-card border-2 border-dashed  flex justify-center items-center cursor-pointer pointer-events-auto aspect-square">
          <input
            id="upload-input"
            type={"file"}
            multiple
            max={10}
            min={1}
            accept={mimeTypes}
            className={cn(
              "opacity-0 absolute left-0 top-0 size-full cursor-pointer"
            )}
            onChange={onFileSelect}
          />
          <Plus />
          <label htmlFor="upload-input" className="sr-only">
            Upload Image
          </label>
        </div>
      )}
      {files?.map((f, i) => (
        <SingleImg
          key={i}
          item={f}
          onRemove={(u) => handleRemove(i, u)}
          onSuccess={handleSuccess}
        />
      ))}
    </div>
  );
}

function SingleImg({
  item,
  onSuccess,
  onRemove,
}: {
  item: { url?: string; file?: File };
  onSuccess: (v: ReturnType<typeof useUpload>["data"]) => void;
  onRemove: (url?: string) => void;
}) {
  const { status, progress, data, resetUpload, cancelUpload } = useUpload({
    file: !item.url && item.file ? item.file : null,
  });

  const { deleteFile, isPending: isDeleting } = useDeleteUpload({
    onSuccess: () => {
      return onRemove(item.url);
    },
  });

  const handleRemove = () => {
    if (item.url) return deleteFile(item.url);
    if (status === "pending") {
      cancelUpload();
    }
    return onRemove();
  };

  React.useEffect(() => {
    if (item.url) return;
    if (status === "success" && data.url) {
      console.log("hit");
      onSuccess?.(data);
    }
  }, [status, data, onSuccess, item]);

  return (
    <div
      className="relative bg-no-repeat bg-center bg-contain bg-white border rounded flex items-center justify-center size-full aspect-square"
      style={{ backgroundImage: `url(${item.url})` }}
    >
      {!isDeleting && (
        <Button
          variant={"outline"}
          size="icon-sm"
          className="-top-2 -right-2 absolute"
          onClick={handleRemove}
          disabled={isDeleting}
          type="button"
        >
          <X />
        </Button>
      )}
      {(isDeleting || status === "pending" || status === "error") && (
        <div className="absolute size-full left-0 top-0 bg-white/40 rounded" />
      )}

      {isDeleting && <Loading className="relative z-10" />}
      {status === "pending" && (
        <div className="relative z-10">
          <CircularProgress percentage={progress} />
        </div>
      )}
      {status === "error" && (
        <Badge
          variant={"white"}
          onClick={() => resetUpload()}
          className="relative z-10"
        >
          Failed! Try again?
        </Badge>
      )}
    </div>
  );
}
