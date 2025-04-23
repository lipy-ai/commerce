import { useEffect, useRef, useState } from "react";

export function useUpload({ file }: { file: File }) {
  type FnType = (id: string) => void | undefined;
  let onRemove: FnType = (_id) => {},
    onSuccess: FnType = (_id) => {},
    onError: FnType = (_id) => {};
  const abortController = useRef(new AbortController());

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const documentUpload = (v: any) => "";

  const reset = () => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);
  };
  useEffect(() => {
    reset();
  }, [file]);

  const uploadFile = async (file: File) => {
    try {
      // Get presigned URL
      const url = await documentUpload({
        filename: file.name,
        contentType: file.type,
        contentLength: file.size,
      });

      // Custom upload with progress
      await uploadWithProgress(url, file);
      setIsSuccess(true);
      onSuccess();
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Upload cancelled");
      } else {
        console.error("Upload failed:", error);
      }
      setIsError(true);
      onError();
    }
  };

  const uploadWithProgress = (url: string, file: File) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        setIsError(true);
        onError();
        reject(new Error("Network error occurred"));
      };

      xhr.onabort = () => {
        reject(new Error("Upload aborted"));
      };

      abortController.current.signal.addEventListener("abort", () =>
        xhr.abort()
      );

      xhr.send(file);
    });
  };

  const cancelUpload = () => {
    abortController.current.abort();
    abortController.current = new AbortController();
    onRemove(data.id);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      data.file && data.status === "pending" && uploadFile(data.file);
    }, 500);
    return () => clearTimeout(timer);
  }, [data.file]);

  return {
    cancelUpload,
    progress,
    onRemove,
    onError,
    onSuccess,
    isLoading,
    isError,
    isSuccess,
    error,
  };
}
