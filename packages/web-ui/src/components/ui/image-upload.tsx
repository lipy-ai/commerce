import React, { useState } from "react";

export default function ImageUpload({ url }: { url?: string }) {
  return (
    <div>
      <div
        style={{
          backgroundImage: url ? `url(${url})` : undefined,
        }}
      />
    </div>
  );
}

function FileUpload({
  data,
  onRemove,
  onSuccess,
  onError,
  employeeUsername,
}: {
  data: SingleFile;
  onRemove: (id: string) => void;
  onSuccess: (id: string) => void;
  onError: (id: string) => void;
  employeeUsername: string;
}) {
  return (
    <div>
      <ProgressPrimitive.Root
        className={"bg-primary/20 relative w-full overflow-hidden rounded-md"}
      >
        <ProgressPrimitive.Indicator
          className="bg-primary/70 absolute left-0 top-0 size-full flex-1 transition-all"
          style={{ transform: `translateX(-${100 - (progress || 0)}%)` }}
        />
        <div className="relative z-10 flex h-8 items-center px-4">
          <div className="flex-1">
            <p className=" line-clamp-1 max-w-screen-sm">{data.file.name}</p>
          </div>
          {data.status === "pending" ? (
            <Button
              variant={"link"}
              className="text-foreground hover:text-primary"
              size={"icon-sm"}
              onClick={cancelUpload}
            >
              <X className="size-4" />
            </Button>
          ) : data.status === "success" ? (
            <Check className="size-4" />
          ) : null}
        </div>
      </ProgressPrimitive.Root>
    </div>
  );
}
