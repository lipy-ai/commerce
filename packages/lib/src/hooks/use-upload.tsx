import { env } from "@envClient";
import { useMutation } from "@tanstack/react-query";
import type { InferResponseType } from "hono";
import { useEffect, useRef, useState } from "react";
import { loggedInUploadApi } from "../api";
import { useAPIMutation } from "../utils/useQueryClient";

type UploadCallbacks = {
  onRemove?: (id?: string) => void;
  onSuccess?: (
    data: InferResponseType<typeof loggedInUploadApi.presigned.$post>
  ) => void;
  onError?: (id?: string) => void;
};

export const useDeleteUpload = ({ onSuccess }: { onSuccess: () => void }) => {
  const { mutateAsync, isPending } = useAPIMutation(
    loggedInUploadApi.index,
    "$delete",
    {
      onSuccess: () => {
        onSuccess();
      },
    }
  );
  const deleteFile = async (url: string) => {
    await mutateAsync({
      json: {
        url,
      },
    });
  };

  return { deleteFile, isPending };
};

export function useUpload(
  {
    file,
  }: {
    file: File | null;
  },
  callbacks: UploadCallbacks = {}
) {
  const [progress, setProgress] = useState(0);
  const abortController = useRef(new AbortController());

  const { onRemove, onSuccess, onError } = callbacks;

  const presignedMutation = useAPIMutation(
    loggedInUploadApi.presigned,
    "$post"
  );

  const getPresignedUrl = async (file: File) => {
    const response = await presignedMutation.mutateAsync({
      json: {
        contentLength: file.size,
        contentType: file.type,
        filename: file.name,
      },
    });
    return response;
  };

  const uploadWithProgress = (url: string, file: File) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.ceil((event.loaded / event.total) * 100);
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        xhr.status === 200
          ? resolve()
          : reject(new Error(`Upload failed with status ${xhr.status}`));
      };

      xhr.onerror = () => {
        reject(new Error("Network error occurred"));
      };

      xhr.onabort = () => {
        reject(new Error("Upload aborted"));
      };

      abortController.current.signal.addEventListener("abort", () => {
        xhr.abort();
      });

      xhr.send(file);
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const data = await getPresignedUrl(file);
      await uploadWithProgress(data.presigned_url, file);
      onSuccess?.(data);
      return data;
    },
    onError: (error: any) => {
      if (error.name === "AbortError") {
        console.log("Upload canceled");
      } else {
        console.error("Upload failed:", error);
      }
      onError?.();
    },
  });

  const cancelUpload = () => {
    abortController.current.abort();
    abortController.current = new AbortController(); // reset controller
    onRemove?.(presignedMutation.data?.id);
  };

  const resetUpload = () => {
    uploadMutation.reset();
    setProgress(0);
    abortController.current = new AbortController();
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const timer = setTimeout(() => {
      if (file && progress !== 100 && !uploadMutation.isPending) {
        uploadMutation.mutate(file);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [file]);

  return {
    cancelUpload,
    resetUpload,
    progress,
    data: {
      ...uploadMutation.data,
      url:
        uploadMutation.data?.path &&
        `${env.CDN_URL}/${presignedMutation.data?.path}`,
    },

    status: uploadMutation.status,
    error: uploadMutation.error,
  };
}
