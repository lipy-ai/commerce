"use client";

import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const DashboardHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex justify-between gap-8 w-full p-2 items-center border-b">
      <div className="flex items-center justify-center">
        <Link to="" className="p-2 hover:[&_svg]:stroke-primary">
          <ChevronLeft className="stroke-2" />
        </Link>{" "}
        <h1 className="font-semibold text-xl leading-0 ">{title}</h1>
      </div>
      <div className="flex-1 flex justify-end"></div>
    </div>
  );
};
