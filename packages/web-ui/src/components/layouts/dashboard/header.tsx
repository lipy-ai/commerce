"use client";

import { Link, useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

export const DashboardHeader = ({
  title,
  children,
<<<<<<< HEAD
  titleChildren,
=======
  titleChildren
>>>>>>> 40fdb8261807ab37047c51a915e62b4ca54bf883
}: {
  title?: string;
  children?: ReactNode;
  titleChildren?: ReactNode;
}) => {
  const router = useRouter();
  const onBack = (e: any) => {
    e.preventDefault();
    router.history.back();
    return false;
  };
  return (
    <div className="bg-muted sticky top-0 z-10 ">
      <div className="flex justify-between gap-8 w-full p-2 items-center border-b bg-background/30">
        <div className="flex items-center justify-center">
          <Link
            to={"/"}
            onClick={onBack}
            className="p-2 hover:[&_svg]:stroke-primary"
          >
            <ChevronLeft className="stroke-2" />
          </Link>{" "}
          {titleChildren && titleChildren}
          <h1 className="font-semibold text-xl leading-0 ">{title}</h1>
        </div>
        <div className="flex-1 flex justify-end xl:px-8 gap-2">{children}</div>
      </div>
    </div>
  );
};
